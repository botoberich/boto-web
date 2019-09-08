import { IThumbnail, IPhotoMetadata } from '../../interfaces/photos.interface';

export const ADD_PHOTO = 'ADD_PHOTO';
export const SET_SKELETON = 'SET_SKELETON';
export const SET_METADATA = 'SET_PHOTO_METADATA';

// Actions
export function addPhoto(photo: IThumbnail) {
    return {
        type: ADD_PHOTO,
        payload: {
            photo,
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

export function setSkeleton(skeleton) {
    return {
        type: SET_SKELETON,
        payload: {
            skeleton,
        },
    };
}
