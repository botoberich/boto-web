import { PhotoModel, ChunkModel } from '../models';
import { putFile, getFile, deleteFile } from 'blockstack';
import { chunkB64, getBase64 } from '../utils/encoding';
import { success, error } from '../utils/apiResponse';
import { of, Subject } from 'rxjs';
import { mergeAll, map } from 'rxjs/operators';
import PhotoWorker from './photo.worker';
import imageCompression from 'browser-image-compression';
import uuid from 'uuid/v4';
import {
    Photo,
    PhotoMetaData,
    PostPhotoInput,
    PostPhotoResult,
    PostPhotosResult,
    GetThumbnailsResult,
    DeletePhotosResult,
    DeletePhotoResult,
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
const _generateThumbnail = async (file: File) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 300,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        const b64 = await getBase64(compressedFile);
        return b64;
    } catch (error) {
        throw new Error(error);
    }
};

export const getThumbnails = async (): Promise<ApiResponse<GetThumbnailsResult>> => {
    try {
        let photos = await PhotoModel.fetchOwnList();
        let photoIds = photos.map(photo => photo._id);
        let fetchThumbnails = photoIds.map(id => getFile(`${BASE_PATH}/${id}/thumbnail`));
        let $thumbnails = of
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
        let photo = await PhotoModel.findById(id);
        let metaData = photo.attrs;
        if (photo.attrs.chunked) {
            let chunks = await ChunkModel.fetchOwnList({
                photoId: id,
            });
            let chunkGroup = await Promise.all(chunks.map(c => getFile(`${BASE_PATH}/${id}/${c.attrs.chunkNumber}`)));
            let combinedPhoto = await worker.combineChunks(chunkGroup);
            return success({ b64: combinedPhoto.b64, metaData });
        } else {
            let gaiaRes = await getFile(`${BASE_PATH}/${id}`);
            let b64 = typeof gaiaRes === 'string' && JSON.parse(gaiaRes).b64;

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
    let $photos = new Subject();
    try {
        let photos = await PhotoModel.fetchOwnList();
        let fetchedCtr = 0;
        let metaData = photos.map(photo => photo.attrs);
        let chunkedPhotos: any[] = await Promise.all(
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

        let getChunkedPhotos = chunkedPhotos
            .map(chunkGroup =>
                chunkGroup.map(chunk => getFile(`${BASE_PATH}/${chunk.attrs.photoId}/${chunk.attrs.chunkNumber}`))
            )
            .map(getChunkGroup => Promise.all(getChunkGroup));

        let getUnchunkedPhotos = photos
            .filter(photo => !photo.attrs.chunked)
            .map(photo => getFile(`${BASE_PATH}/${photo._id}`));

        let $chunkedPhotos = of
            .apply(this, getChunkedPhotos)
            .pipe(mergeAll())
            .subscribe(async chunks => {
                let photo = await _combineChunks(chunks);
                $photos.next(photo);
                fetchedCtr++;
                checkComplete();
            });

        let $unchunkedPhotos = of
            .apply(this, getUnchunkedPhotos)
            .pipe(mergeAll())
            .subscribe(unchunkedPhoto => {
                if (unchunkedPhoto && unchunkedPhoto.length) {
                    let { photoId, b64 } = JSON.parse(unchunkedPhoto);
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

export const postPhotos = async (photos: PostPhotoInput[]): Promise<ApiResponse<PostPhotosResult>> => {
    try {
        let postCtr = 0;
        const $photos = new Subject<PostPhotoResult>();
        const postResponses = await Promise.all(
            photos.map(photo => {
                return _postPhoto({ metaData: photo.metaData, file: photo.file });
            })
        );

        let postPhotos = postResponses.map(res => res.postPhoto);
        let photoIds = postResponses.map(res => res.photoId);
        const checkComplete = () => {
            if (photos.length === postCtr) $photos.complete();
        };
        let $postPhotos = of
            .apply(this, postPhotos)
            .pipe(mergeAll())
            .subscribe({
                next: (postRes: PostPhotoResult) => {
                    $photos.next(postRes);
                    postCtr++;
                    checkComplete();
                },
                error: async errRes => {
                    /** Remove thumbnail */
                    await deleteFile(`${BASE_PATH}/${errRes.photoId}/thumbnail`);
                    $photos.error(errRes.error);
                },
            });
        return success({ photoIds, $photos });
    } catch (err) {
        return error(err);
    }
};

/**
 * @returns If not err, a success response with data: { metadata, $photo }
 * @param {*} metadata Photo metadata: refer to the photo model@ /models/photo
 * @param {*} file File to upload
 */
export const _postPhoto = async ({
    metaData,
    file,
}: PostPhotoInput): Promise<{ photoId: string; postPhoto: Promise<PostPhotoResult> }> => {
    /** Store all metadata in the database and store b64 in gaia */
    const photoId: string = uuid();
    const gaiaPath = `${BASE_PATH}/${photoId}`;
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
            ...metaData,
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
        let deletes = ids.map(id => _deletePhoto(id));
        let $deletes = of.apply(this, deletes).pipe(mergeAll());
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
            let deleteInRadik = await photo.destroy();
            if (deleteInRadik) {
                /** you only wanna delete in GAIA if the entry is deleted in radiks */
                await deleteFile(`${BASE_PATH}/${id}/thumbnail`);
                if (photo.attrs.chunked) {
                    let chunks = await ChunkModel.fetchOwnList({
                        photoId: id,
                    });
                    let deleteChunksInRadik = await Promise.all(chunks.map(chunk => chunk.destroy()));
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
