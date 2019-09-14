import { ICreateAlbumFormData } from '../../interfaces/albums.interface';

export const SET_ALBUM_METADATA = 'SET_ALBUM_METADATA';
export const SET_ALBUMS_METADATA = 'SET_ALBUMS_METADATA';
export const SET_ALBUM_PHOTO_METADATA = 'SET_ALBUM_PHOTO_METADATA';
export const NEXT_ALBUM_PHOTO = 'NEXT_ALBUM_PHOTO';
export const REMOVE_ALBUM_PHOTO = 'REMOVE_ALBUM_PHOTO';

export const setAlbumMetaData = (albumID, metadata) => {
    return {
        type: SET_ALBUM_METADATA,
        payload: {
            albumID,
            metadata,
        },
    };
};

export const setAlbumsMetaData = albums => {
    return {
        type: SET_ALBUMS_METADATA,
        payload: {
            albums,
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

export const removeAlbumPhotos = (albumID, photoIDs) => {
    return {
        type: REMOVE_ALBUM_PHOTO,
        payload: {
            albumID,
            photoIDs,
        },
    };
};
