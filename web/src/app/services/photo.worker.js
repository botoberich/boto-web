// import { putFile, getFile, deleteFile } from 'blockstack';

// importScripts('blockstack');

// export const BlockstackPutFile = (...args) => {
//     return putFile(...args);
// };

// export const BlockstackGetFile = (...args) => {
//     return getFile(...args);
// };

// export const BlockstackDeleteFile = (...args) => {
//     return deleteFile(...args);
// };

// self.putFile = (...args) => importScripts('blockstack').putFile(...args);

/**
 * @param chunkGroup - An array of chunks retrieved from gaia, when combined creates a complete b64 representation of a photo
 * @returns An object with attributes photoId and b64
 */
export const combineChunks = chunkGroup => {
    let photoId = null;
    let b64 = chunkGroup
        .map(chunk => JSON.parse(chunk))
        .sort((a, b) => (a.chunkNumber < b.chunkNumber ? -1 : 1))
        .map(sorted => {
            if (!photoId) photoId = sorted.photoId;
            return sorted.b64;
        })
        .join('');

    return {
        photoId,
        b64,
    };
};

export function fillPendingPhotos(len, metaData) {
    return Array(len)
        .fill({})
        .reduce((acc, _, index) => {
            return {
                ...acc,
                [metaData[index]._id]: {
                    src: null,
                    title: metaData[index].title,
                    id: metaData[index]._id,
                },
            };
        }, {});
}
