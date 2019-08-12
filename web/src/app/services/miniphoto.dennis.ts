import PhotoModel from '../models/photo.model';
import MiniPhotoModel from '../models/mini-photo.model';
import { putFile, getFile } from 'blockstack';
import ChunkModel from '../models/chunk.model';
import { chunkB64, getBase64 } from '../utils/encoding';
import { success, error } from '../utils/apiResponse';
// import * as EXIF from 'exif-js';
import { of, Subject } from 'rxjs';
import { mergeAll } from 'rxjs/operators';
import PhotoWorker from './photo.worker';
import imageCompression from 'browser-image-compression';

const BASE_PATH = `user/photos`;
const GAIA_LIMIT = 12582912; /** 12.5 MB in bytes, size increases when turning blob bytes into storable text */
const worker = typeof window !== 'undefined' && PhotoWorker();

export interface Photo {
    b64: string;
    metaData: MetaData;
}

export interface MetaData {
    archived: boolean;
    title: string;
    trashed: boolean;
}

export const getMiniPhotos = async () => {
    try {
        const miniPhotos = await MiniPhotoModel.fetchOwnList();
        console.log('Fetched all mini photos successfully');
        console.log(miniPhotos);
        if (miniPhotos) {
            const metaData = miniPhotos.map(mini => mini.attrs);
            const photos = miniPhotos.map(mini => {
                return {
                    photoId: mini.attrs.photoId,
                    src: mini.attrs.src,
                    id: mini._id,
                };
            });
            console.log({ photos });
            return success({ metaData, photos });
        }
    } catch (e) {
        console.error('Failed to fetch all mini photos');
        return error(e);
    }
};

export const postMiniPhoto = async (photo: File, originalPhotoId: string) => {
    /**
     * We need to set a threshold on when we should compress - Example: above 25MB
     * Because photos that are small in size end up looking jagged and poor quality.
     */
    const miniFile = await compressPhoto(photo);
    const miniBase64: string = await getBase64(miniFile);

    // Have Radiks index our files for us
    const radiksMiniPhoto = new MiniPhotoModel({
        src: miniBase64,
        photoId: originalPhotoId,
    });

    /**
     * You don't wanna store base64 in our radiks database.
     * 1 - Even if it's compressed, the load could add up and cause our db to blow up
     * 2 - Use radiks as a tool to index into our actual b64 stored in Gaia | how current fetch is doing it
     */

    radiksMiniPhoto.save();

    // But we...also store the actual content. Can't Radiks just do this for us as well?
    const gaiaPath = `${BASE_PATH}/${originalPhotoId}/mini`;
    try {
        /**
         * Now you have two sources of truth for all b64 data - one in our radiks db and one in gaia
         * Let's not do that. Let's store b64 in gaia and store ONLY metadata in our radiks db then use id to index into gaia and fetch the b64
         */

        const resp = await putFile(gaiaPath, miniBase64);
        console.log('Mini photo post successful');
        return success(resp);
    } catch (e) {
        console.error('Mini photo post failed');
        return error(e);
    }
};

export const deleteMiniPhoto = async (miniPhotoId: string) => {
    try {
        const mini = await MiniPhotoModel.findById(miniPhotoId);
        if (mini) {
            console.log('mini photo found by id', mini);
            const originalPhotoId = mini.attrs.photoId;
            const gaiaPath = `${BASE_PATH}/${originalPhotoId}/mini`;
            // Just let Aaron's delete method do its thing
            deletePhoto(originalPhotoId);
            await mini.destroy();
            return deleteFile(gaiaPath).then(res => success(res));
        }
    } catch (e) {
        console.error('Failed to find mini photo id');
        return error(e);
    }
};

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

/**
 * @returns If not err, a success response with data - { metaData, $photos }
 * - metaData: an array of photo metadata fetched from radiks server
 * - $photos: an observable that streams { photoId , b64 }
 */
export const getOwnPhotos = async () => {
    let $photos = new Subject();
    try {
        let photos = await PhotoModel.fetchOwnList();
        let fetchedCtr = 0;
        let metaData = photos.map(photo => photo.attrs);
        let chunkedPhotos = await Promise.all(
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
            .map(chunkGroup => chunkGroup.map(chunk => getFile(`${BASE_PATH}/${chunk.attrs.photoId}/${chunk.attrs.chunkNumber}`)))
            .map(getChunkGroup => Promise.all(getChunkGroup));

        let getUnchunkedPhotos = photos.filter(photo => !photo.attrs.chunked).map(photo => getFile(`${BASE_PATH}/${photo._id}`));

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
                    let [_, photoId, b64] = unchunkedPhoto.split('|');
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

export const postPhotos = async (photos: Photo[]) => {
    try {
        const postResponses = await Promise.all(
            photos.map(photo => {
                return _postPhoto(photo.metaData, photo.b64);
            })
        );
        let postPhotos = postResponses.map(res => res.data.postPhoto);
        let photoIds = postResponses.map(res => res.data.photoId);
        let $postPhotos = of.apply(this, postPhotos).pipe(mergeAll());
        return success({ photoIds, $postPhotos });
    } catch (err) {
        return error(err);
    }
};

export const compressPhoto = async (file: File) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 300,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
        return compressedFile;
    } catch (error) {
        console.log(error);
    }
};

/**
 * @returns If not err, a success response with data: { metadata, $photo }
 * @param {*} metadata Photo metadata: refer to the photo model@ /models/photo
 * @param {*} b64 Base64 data representation of the photo
 */
export const _postPhoto = async (metaData: MetaData, b64: string) => {
    /** Store all metadata in the database, get the ID and store blob in gaia */
    try {
        const chunkedBlobTexts = await chunkB64(b64, GAIA_LIMIT);

        const photo = new PhotoModel({
            ...metaData,
            chunked: chunkedBlobTexts.length > 1,
        });
        const saveRes = await photo.save();
        const photoId = saveRes._id;
        const gaiaPath = `${BASE_PATH}/${photoId}`;
        const resolveWithId = promise => {
            return new Promise(async (resolve, reject) => {
                await promise;
                resolve({ photoId });
            });
        };
        if (chunkedBlobTexts.length > 1) {
            /** store chunks in radik */
            const dbPosts = chunkedBlobTexts.map((txt, i) =>
                new ChunkModel({
                    chunkNumber: i,
                    photoId,
                }).save()
            );

            /** store chunks in gaia */
            try {
                const gaiaPosts = chunkedBlobTexts.map((txt, i) => (`${gaiaPath}/${i}`, `${i}|${photoId}|${txt}`));
            } catch (e) {}

            const postPhoto = resolveWithId(Promise.all([...dbPosts, ...gaiaPosts]));
            return success({ photoId, postPhoto });
        } else {
            const postPhoto = resolveWithId(putFile(gaiaPath, `-|${photoId}|${chunkedBlobTexts[0]}`));
            return success({ photoId, postPhoto });
        }
    } catch (err) {
        throw new Error(`Photo post error: ${err}`);
    }
};

export const deletePhoto = async (id: string) => {
    try {
        const photo = await PhotoModel.findById(id);
        const deletes = { photo: null, chunks: null };
        if (photo) {
            let deleteInRadik = await photo.destroy(); /** you only wanna delete in GAIA if the entry is deleted in radiks */
            if (deleteInRadik) {
                deletes.photo = deleteInRadik;
            }
            `${BASE_PATH}/${photo._id}`;

            if (photo.attrs.chunked) {
                let chunks = await ChunkModel.fetchOwnList({
                    photoId: photo._id,
                });
                let deleteChunksInRadik = await Promise.all(chunks.map(chunk => ChunkModel.destroy()));
                if (deleteChunksInRadik.length === chunks.length) {
                    for (let i = 0; i < chunks.length; i++) {}
                    deletes.chunks = deleteChunksInRadik;
                    `${BASE_PATH}/${photo._id}/${chunks[i].attrs.chunkNumber}`;
                }
            }
            return success(deletes);
        }
        return error(`Photo with id: ${id} not found.`);
    } catch (err) {
        return error('Delete photo err:', err);
    }
};
