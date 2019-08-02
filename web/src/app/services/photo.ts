import { putFile, getFile, deleteFile } from 'blockstack';
import Photo from '../models/photo';
import Chunk from '../models/chunk';
import { chunkB64 } from '../utils/encoding';
import { success, error } from '../utils/apiResponse';
import * as EXIF from 'exif-js';
import { of, Subject } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

const BASE_PATH = `user/photos`;
const GAIA_LIMIT = 12582912; /** 12.5 MB in bytes, size increases when turning blob bytes into storable text */

/**
 * @param chunkGroup - An array of chunks retrieved from gaia, when combined creates a complete b64 representation of a photo
 * @returns An object with attributes photoId and b64
 */
const _combineChunks = chunkGroup => {
    let photoId = null;
    let b64 = chunkGroup
        .sort((a, b) => {
            if (a.split('|')[0] < b.split('|')[0]) {
                return -1;
            } else {
                return 1;
            }
        })
        .map(chunk => {
            let split = chunk.split('|');
            if (!photoId) photoId = split[1];
            return split[2];
        })
        .join('');

    return {
        photoId,
        b64,
    };
};

/**
 * @returns If not err, a success response with data - { metaData, $photos }
 * - metaData: an array of photo metadata fetched from radiks server
 * - $photos: an observable that streams { photoId , b64 }
 */
export const getOwnPhotos = async () => {
    let $photos = new Subject();
    try {
        let photos = await Photo.fetchOwnList();
        let fetchedCtr = 0;
        let metaData = photos.map(photo => photo.attrs);
        let chunkedPhotos = await Promise.all(
            photos
                .filter(photo => photo.attrs.chunked)
                .map(photo =>
                    Chunk.fetchOwnList({
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
            .subscribe(chunks => {
                let photo = _combineChunks(chunks);
                $photos.next(photo);
                fetchedCtr++;
                checkComplete();
            });

        let $unchunkedPhotos = of
            .apply(this, getUnchunkedPhotos)
            .pipe(mergeAll())
            .subscribe(unchunkedPhoto => {
                let [_, photoId, b64] = unchunkedPhoto.split('|');
                fetchedCtr++;
                $photos.next({
                    photoId,
                    b64,
                });
                checkComplete();
            });
        return success({ metaData, $photos });
    } catch (err) {
        return error(err);
    }
};

export const postPhotos = async photos => {
    try {
        debugger;
        let postResponses = await Promise.all(photos.map(photo => _postPhoto(photo.metaData, photo.b64)));
        debugger;
        let postPhotos = postResponses.map(res => res.data.postPhoto);
        debugger;
        let photoIds = postResponses.map(res => res.data.photoId);
        debugger;
        let $postPhotos = of.apply(this, postPhotos).pipe(mergeAll());
        return success({ photoIds, $postPhotos });
    } catch (err) {
        return error(err);
    }
};

/**
 * @returns If not err, a success response with data: { metadata, $photo }
 * @param {*} metadata Photo metadata: refer to the photo model@ /models/photo
 * @param {*} b64 Base64 data representation of the photo
 */
export const _postPhoto = async (metaData, b64) => {
    /** Store all metadata in the database, get the ID and store blob in gaia */
    try {
        debugger;
        const chunkedBlobTexts = chunkB64(b64, GAIA_LIMIT);

        debugger;
        const photo = new Photo({
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
                new Chunk({
                    chunkNumber: i,
                    photoId,
                }).save()
            );

            /** store chunks in gaia */
            const gaiaPosts = chunkedBlobTexts.map((txt, i) => putFile(`${gaiaPath}/${i}`, `${i}|${photoId}|${txt}`));

            const postPhoto = resolveWithId(Promise.all([...dbPosts, ...gaiaPosts]));
            return success({ photoId, postPhoto });
        } else {
            const postPhoto = resolveWithId(putFile(gaiaPath, `-|${photoId}|${chunkedBlobTexts[0]}`));
            return success({ photoId, postPhoto });
        }
    } catch (err) {
        throw new Error('Post photo err:', err);
    }
};

export const deletePhoto = async id => {
    try {
        const photo = await Photo.findById(id);
        const deletes = { photo: null, chunks: null };
        if (photo) {
            let deleteInRadik = await photo.destroy(); /** you only wanna delete in GAIA if the entry is deleted in radiks */
            if (deleteInRadik) {
                deleteFile(`${BASE_PATH}/${photo._id}`);
                deletes.photo = deleteInRadik;
            }

            if (photo.attrs.chunked) {
                let chunks = await Chunk.fetchOwnList({
                    photoId: photo._id,
                });
                let deleteChunksInRadik = await Promise.all(chunks.map(chunk => chunk.destroy()));
                if (deleteChunksInRadik.length === chunks.length) {
                    for (let i = 0; i < chunks.length; i++) {
                        deleteFile(`${BASE_PATH}/${photo._id}/${chunks[i].attrs.chunkNumber}`);
                    }
                    deletes.chunks = deleteChunksInRadik;
                }
            }
            return success(deletes);
        }
        return error(`Photo with id: ${id} not found.`);
    } catch (err) {
        return error('Delete photo err:', err);
    }
};
