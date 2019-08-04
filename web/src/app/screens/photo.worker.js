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

export function mapPhotoToPlaceholder(photos, incomingPhoto) {
    const { photoId, b64 } = incomingPhoto;
    return {
        ...photos,
        [photoId]: {
            id: photoId,
            src: `data:image/gif;base64,${b64}`,
        },
    };
}

export function fromValues(object) {
    return Object.values(object);
}
