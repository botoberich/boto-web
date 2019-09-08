import { ADD_PHOTO, SET_METADATA } from './photo.actions';
import { IThumbnail, IPhotoMetadata } from '../../interfaces/photos.interface';

// Reducer
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
        case ADD_PHOTO:
            return {
                ...state,
                photos: [...state.photos, action.payload.photo],
            };
        case SET_METADATA:
            return {
                ...state,
                metaData: [...action.payload.metaData],
            };
        default:
            return {
                ...state,
            };
    }
}

export default PhotoReducer;
