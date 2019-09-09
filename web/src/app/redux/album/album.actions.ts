export const SET_ALBUM_METADATA = 'SET_ALBUM_METADATA';
export const SET_ALBUM_PHOTO_METADATA = 'SET_ALBUM_PHOTO_METADATA';
export const NEXT_ALBUM_PHOTO = 'NEXT_ALBUM_PHOTO';

export const setAlbumMetaData = (albumID, metadata) => {
    return {
        type: SET_ALBUM_METADATA,
        payload: {
            albumID,
            metadata,
        },
    };
};

export const setAlbumPhotoMetaData = (albumID, photoMetadata) => {
    return {
        type: SET_ALBUM_PHOTO_METADATA,
        payload: {
            albumID,
            metadata: photoMetadata,
        },
    };
};

export const nextAlbumPhoto = (albumID, photo) => {
    return {
        type: NEXT_ALBUM_PHOTO,
        payload: {
            albumID,
            photo,
        },
    };
};
