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

/** this doesn't work... it's weird because handleTestExif in Photo.jsx works */
const getExifData = b64 => {
    let img = document.createElement('img');
    img.src = `data:image/jpeg;base64,${b64}`;
    img.alt = 'DEFAULT_IMG';

    EXIF.getData(img, function() {
        var tags = EXIF.getAllTags(this);
        console.log({ tags });
    });
};

const _combineChunks = (chunkGroup, photos) => {
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

    let photoMetadata = photos.filter(photo => photo._id === photoId)[0] || { attrs: {} };
    return {
        ...photoMetadata,
        b64,
    };
};

/**
 * @returns API response object with data: error or array of objects { ...photoMetadata, b64 } (refer to models/photo for photoMetadata schema)
 */
export const getOwnPhotos = async () => {
    let $photos = new Subject();
    try {
        let photos = await Photo.fetchOwnList();
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

        let getChunkedPhotos = chunkedPhotos
            .map(chunkGroup =>
                chunkGroup.map(chunk => getFile(`${BASE_PATH}/${chunk.attrs.photoId}/${chunk.attrs.chunkNumber}`))
            )
            .map(getChunkGroup => Promise.all(getChunkGroup));

        let $chunkedPhotos = of
            .apply(this, getChunkedPhotos)
            .pipe(mergeAll())
            .subscribe(chunks => {
                let photo = _combineChunks(chunks, photos);
                $photos.next(photo);
            });

        let getUnchunkedPhotos = photos
            .filter(photo => !photo.attrs.chunked)
            .map(photo => getFile(`${BASE_PATH}/${photo._id}`));

        let $unchunkedPhotos = of
            .apply(this, getUnchunkedPhotos)
            .pipe(mergeAll())
            .subscribe(unchunkedPhoto => {
                let [_, id, b64] = unchunkedPhoto.split('|');
                let photoMetadata = photos.filter(photo => photo._id === id)[0] || { attrs: {} };
                let photo = {
                    ...photoMetadata.attrs,
                    b64,
                };
                $photos.next(photo);
            });
        return success($photos);
    } catch (err) {
        return error(err);
    }
};

/**
 * @returns API response object with data: error or uploaded photos
 * @param {*} metadata Photo metadata: refer to the photo model@ /models/photo
 * @param {*} b64 Base64 data representation of the photo
 */
export const postPhoto = async (metadata, b64) => {
    /** Store all metadata in the database, get the ID and store blob in gaia */
    try {
        const chunkedBlobTexts = chunkB64(b64, GAIA_LIMIT);
        const photo = new Photo({
            ...metadata,
            chunked: chunkedBlobTexts.length > 1,
        });
        const saveRes = await photo.save();
        const gaiaPath = `${BASE_PATH}/${saveRes._id}`;
        if (chunkedBlobTexts.length > 1) {
            /** store chunks in radik */
            const dbPosts = chunkedBlobTexts.map((txt, i) =>
                new Chunk({
                    chunkNumber: i,
                    photoId: saveRes._id,
                }).save()
            );

            /** store chunks in gaia */
            const gaiaPosts = chunkedBlobTexts.map((txt, i) =>
                putFile(`${gaiaPath}/${i}`, `${i}|${saveRes._id}|${txt}`)
            );

            const [radikRes, gaiaRes] = await Promise.all([...dbPosts, ...gaiaPosts]);
            return success(radikRes);
        } else {
            await putFile(gaiaPath, `-|${saveRes._id}|${chunkedBlobTexts[0]}`);
            return success(saveRes);
        }
    } catch (err) {
        return error('Post photo err:', err);
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
                    chunks.map(chunk => deleteFile(`${BASE_PATH}/${photo._id}/${chunk.attrs.chunkNumber}`));
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
