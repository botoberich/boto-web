export const SET_ALBUM_METADATA = 'SET_ALBUM_METADATA';
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

export const nextAlbumPhoto = photo => {
    return {
        type: NEXT_ALBUM_PHOTO,
        payload: {
            photo,
        },
    };
};
