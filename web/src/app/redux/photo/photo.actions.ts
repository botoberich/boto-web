import { IThumbnail, IPhotoMetadata } from '../../interfaces/photos.interface';

export const NEW_PHOTO = "NEW_PHOTO"
export const NEXT_PHOTO = 'NEXT_PHOTO';
export const REMOVE_PHOTO = 'REMOVE_PHOTO';
export const SET_METADATA = 'SET_PHOTO_METADATA';

// Actions
export function newPhoto(photo: IThumbnail) {
    return {
        type: NEW_PHOTO,
        payload: {
            photo,
        },
    };
}

export function nextPhoto(photo: IThumbnail) {
    return {
        type: NEXT_PHOTO,
        payload: {
            photo,
        },
    };
}

export function removePhoto(metaData: IPhotoMetadata) {
    return {
        type: REMOVE_PHOTO,
        payload: {
            metaData,
        },
    };
}

export function setMetaData(metaData: IPhotoMetadata[]) {
    return {
        type: SET_METADATA,
        payload: {
            metaData,
        },
    };
}
