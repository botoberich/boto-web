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
