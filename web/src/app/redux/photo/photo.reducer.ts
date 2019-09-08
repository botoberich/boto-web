import { IThumbnail } from '../../interfaces/photos.interface';

interface PhotoReducerState {
    photos: IThumbnail[];
}

const INITIAL_STATE = {
    photos: [],
};

function PhotoReducer(state = INITIAL_STATE, action): PhotoReducerState {
    switch (action.type) {
        default:
            return {
                ...state,
            };
    }
}

export default PhotoReducer;
