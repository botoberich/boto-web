import { NEXT_PHOTO, SET_METADATA, REMOVE_PHOTO } from './photo.actions';
import { IThumbnail, IPhotoMetadata } from '../../interfaces/photos.interface';

interface PhotoReducerState {
    photos: IThumbnail[];
    metaData: IPhotoMetadata[];
}

const INITIAL_STATE = {
    metaData: [],
    photos: [],
};

function PhotoReducer(state = INITIAL_STATE, action): PhotoReducerState {
    switch (action.type) {
        case NEXT_PHOTO:
            return {
                ...state,
                photos: [...state.photos, action.payload.photo],
            };
        case SET_METADATA:
            return {
                ...state,
                metaData: [...action.payload.metaData],
            };
        case REMOVE_PHOTO:
            return {
                ...state,
                metaData: state.metaData.filter(photoMeta => photoMeta._id !== action.payload.metaData._id),
                photos: state.photos.filter(photo => photo.metaData._id !== action.payload.metaData._id),
            };
        default:
            return {
                ...state,
            };
    }
}

export default PhotoReducer;
