import { PhotoModel, ChunkModel } from '../models';
import { putFile, getFile, deleteFile } from 'blockstack';
import { chunkB64, getBase64 } from '../utils/encoding';
import { getPhotoMetaData } from '../utils/metadata';
import { success, error } from '../utils/apiResponse';
import { of, Subject } from 'rxjs';
import { mergeAll, map } from 'rxjs/operators';
import PhotoWorker from './photo.worker';
import Compressor from 'compressorjs';
import uuid from 'uuid/v4';
import {
    Photo,
    PhotoMetaData,
    PostPhotoResult,
    PostPhotosResult,
    GetThumbnailsResult,
    DeletePhotosResult,
} from '../interfaces/photos.interface';
import { ResponseStatus, ApiResponse } from '../interfaces/response.interface';
import { string } from 'prop-types';

const BASE_PATH = `user/photos`;
const CHUNK_SIZE = 12582912; /** 12.5 MB in bytes, size increases when turning blob bytes into storable text */
const worker = typeof window !== 'undefined' && PhotoWorker();

/**
 * @param chunkGroup - An array of chunks retrieved from gaia, when combined creates a complete b64 representation of a photo
 * @returns An object with attributes photoId and b64
 */
const _combineChunks = async chunkGroup => {
    let chunks;
    if (worker) {
        chunks = await worker.combineChunks(chunkGroup);
    }
    return chunks;
};

/** @returns a b64 string representing a photo smaller in size than the actual photo */
const _generateThumbnail = async (file: File): Promise<string> => {
    const quality = 0.6;
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality,
            async success(result) {
                let b64 = await getBase64(result);
                resolve(b64);
            },
            error(err) {
                reject(err);
            },
        });
    });
};

export const getThumbnails = async (): Promise<ApiResponse<GetThumbnailsResult>> => {
    try {
        const photos = await PhotoModel.fetchOwnList();
        const photoIds = photos.map(photo => photo._id);
        const fetchThumbnails = photoIds.map(id => getFile(`${BASE_PATH}/${id}/thumbnail`));
        const $thumbnails = of
            .apply(this, fetchThumbnails)
            .pipe(mergeAll())
            .pipe(map((json: string) => JSON.parse(json)));
        return success({ photoIds, $thumbnails });
    } catch (err) {
        return error(err);
    }
};

export const getPhotoById = async (id: string): Promise<ApiResponse<Photo>> => {
    try {
        const photo = await PhotoModel.findById(id);
        const metaData = photo.attrs;
        if (photo.attrs.chunked) {
            const chunks = await ChunkModel.fetchOwnList({
                photoId: id,
            });
            const chunkGroup = await Promise.all(chunks.map(c => getFile(`${BASE_PATH}/${id}/${c.attrs.chunkNumber}`)));
            const combinedPhoto = await worker.combineChunks(chunkGroup);
            return success({ b64: combinedPhoto.b64, metaData });
        } else {
            const gaiaRes = await getFile(`${BASE_PATH}/${id}`);
            const b64 = typeof gaiaRes === 'string' && JSON.parse(gaiaRes).b64;

            return success({ b64, metaData });
        }
    } catch (err) {
        return error(err);
    }
};

/**
 * @returns If not err, a success response with data - { metaData, $photos }
 * - metaData: an array of photo metadata fetched from radiks server
 * - $photos: an observable that streams { photoId , b64 }
 */
export const getPhotos = async () => {
    const $photos = new Subject();
    try {
        const photos = await PhotoModel.fetchOwnList();
        let fetchedCtr = 0;
        const metaData = photos.map(photo => photo.attrs);
        const chunkedPhotos: any[] = await Promise.all(
            photos
                .filter(photo => photo.attrs.chunked)
                .map(photo =>
                    ChunkModel.fetchOwnList({
                        photoId: photo._id,
                        sort: 'chunkNumber-',
                    })
                )
        );

        const checkComplete = () => {
            if (photos.length === fetchedCtr) $photos.complete();
        };

        const getChunkedPhotos = chunkedPhotos
            .map(chunkGroup =>
                chunkGroup.map(chunk => getFile(`${BASE_PATH}/${chunk.attrs.photoId}/${chunk.attrs.chunkNumber}`))
            )
            .map(getChunkGroup => Promise.all(getChunkGroup));

        const getUnchunkedPhotos = photos
            .filter(photo => !photo.attrs.chunked)
            .map(photo => getFile(`${BASE_PATH}/${photo._id}`));

        /** Stream chunked photos */
        of.apply(this, getChunkedPhotos)
            .pipe(mergeAll())
            .subscribe(async chunks => {
                const photo = await _combineChunks(chunks);
                $photos.next(photo);
                fetchedCtr++;
                checkComplete();
            });

        /** Stream unchunked photos */
        of.apply(this, getUnchunkedPhotos)
            .pipe(mergeAll())
            .subscribe(unchunkedPhoto => {
                if (unchunkedPhoto && unchunkedPhoto.length) {
                    const { photoId, b64 } = JSON.parse(unchunkedPhoto);
                    fetchedCtr++;
                    $photos.next({
                        photoId,
                        b64,
                    });
                    checkComplete();
                }
            });
        return success({ metaData, $photos });
    } catch (err) {
        return error(err);
    }
};

export const postPhotos = async (photos: File[]): Promise<ApiResponse<PostPhotosResult>> => {
    try {
        let postCtr = 0;
        const $photos = new Subject<PostPhotoResult>();
        const postResponses = await Promise.all(photos.map(file => _postPhoto(file)));

        const postPhotos = postResponses.map(res => res.postPhoto);
        const photoIds = postResponses.map(res => res.photoId);
        const checkComplete = () => {
            if (photos.length === postCtr) $photos.complete();
        };
        const $postPhotos = of
            .apply(this, postPhotos)
            .pipe(mergeAll())
            .subscribe({
                next: (postRes: PostPhotoResult) => {
                    $photos.next(postRes);
                    postCtr++;
                    checkComplete();
                },
                error: async err => {
                    /** Remove thumbnail */
                    await deleteFile(`${BASE_PATH}/${err.photoId}/thumbnail`);
                    $photos.error(err.error);
                },
            });
        return success({ photoIds, $photos });
    } catch (err) {
        return error(err);
    }
};

export const _postPhoto = async (file: File): Promise<{ photoId: string; postPhoto: Promise<PostPhotoResult> }> => {
    /** Store all metadata in the database and store b64 in gaia */
    const photoId: string = uuid();
    const gaiaPath = `${BASE_PATH}/${photoId}`;
    let metaData = await getPhotoMetaData(file); /** if you want data from exif, use metaData.exif */
    let thumbnailUploaded = false;
    try {
        const [thumbnail, original]: [string, string] = await Promise.all([_generateThumbnail(file), getBase64(file)]);
        const b64Chunks = await chunkB64(original, CHUNK_SIZE);

        /** Upload thumbnail */
        await putFile(`${gaiaPath}/thumbnail`, JSON.stringify({ photoId, b64: thumbnail }));
        thumbnailUploaded = true;

        /** Upload original photo */
        const photo = new PhotoModel({
            _id: photoId,
            ...metaData.base,
            chunked: b64Chunks.length > 1,
        });
        const saveRes = await photo.save();

        /** @return a promise that awaits all posts (radiks, gaia), and resolves with photoId and thumnail if successful */
        const handlePosts = posts => {
            return new Promise<{ photoId: string; thumbnail: string }>(async (resolve, reject) => {
                try {
                    await posts;
                    resolve({ photoId, thumbnail });
                } catch (error) {
                    reject({ photoId, error });
                }
            });
        };

        if (b64Chunks.length > 1) {
            /** store chunks in radik */
            const radiksPosts = b64Chunks.map((txt, i) =>
                new ChunkModel({
                    chunkNumber: i,
                    photoId,
                }).save()
            );

            /** store chunks in gaia */
            const gaiaPosts = b64Chunks.map((chunk, i) =>
                putFile(`${gaiaPath}/${i}`, JSON.stringify({ photoId, chunkNumber: i, b64: chunk }))
            );
            const postPhoto = handlePosts(Promise.all([...radiksPosts, ...gaiaPosts]));
            return { photoId, postPhoto };
        } else {
            const postPhoto = handlePosts(putFile(gaiaPath, JSON.stringify({ photoId, b64: b64Chunks[0] })));
            return { photoId, postPhoto };
        }
    } catch (err) {
        if (thumbnailUploaded) {
            await deleteFile(`${BASE_PATH}/${photoId}/thumbnail`);
        }
        throw new Error(err);
    }
};

export const deletePhotos = async (ids: string[]): Promise<ApiResponse<DeletePhotosResult>> => {
    try {
        const deletes = ids.map(id => _deletePhoto(id));
        const $deletes = of.apply(this, deletes).pipe(mergeAll());
        return success({ $deletes });
    } catch (err) {
        return error(err);
    }
};

export const _deletePhoto = async (id: string): Promise<string> => {
    try {
        const photo = await PhotoModel.findById(id);
        const deletes = { photo: null, chunks: null };
        if (photo) {
            const deleteInRadik = await photo.destroy();
            if (deleteInRadik) {
                /** you only wanna delete in GAIA if the entry is deleted in radiks */
                await deleteFile(`${BASE_PATH}/${id}/thumbnail`);
                if (photo.attrs.chunked) {
                    const chunks = await ChunkModel.fetchOwnList({
                        photoId: id,
                    });
                    const deleteChunksInRadik = await Promise.all(chunks.map(chunk => chunk.destroy()));
                    if (deleteChunksInRadik.length === chunks.length) {
                        /** you only wanna delete in GAIA if the chunks are deleted in radiks */
                        await Promise.all(chunks.map(c => deleteFile(`${BASE_PATH}/${id}/${c.attrs.chunkNumber}`)));
                        deletes.chunks = deleteChunksInRadik;
                    }
                } else {
                    await deleteFile(`${BASE_PATH}/${id}`);
                    deletes.photo = deleteInRadik;
                }
            }
            return id;
        }
        throw new Error(`Photo with id: ${id} not found.`);
    } catch (err) {
        throw new Error(`Delete photo err: ${err}`);
    }
};
