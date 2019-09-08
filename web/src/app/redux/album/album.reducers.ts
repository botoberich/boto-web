import { IAlbumMetadata } from '../../interfaces/albums.interface';
import { IThumbnail } from '../../interfaces/photos.interface';
import { NEXT_ALBUM_PHOTO, SET_ALBUM_METADATA } from './album.actions';

// Reducer
interface AlbumReducerState {
    albums: {
        [id: string]: {
            photos: IThumbnail[];
            albumMetadata: IAlbumMetadata;
        };
    };
}

const INITIAL_STATE = {
    albums: {},
};

function AlbumReducer(state = INITIAL_STATE, action): AlbumReducerState {
    switch (action.type) {
        case SET_ALBUM_METADATA: {
            const albums = {
                ...state.albums,
                [action.payload.albumID]: {
                    photos: [],
                    albumMetadata: action.payload.metadata,
                },
            };
            return {
                ...state,
                albums,
            };
        }
        case NEXT_ALBUM_PHOTO: {
            return {
                ...state,
            };
        }
        default:
            return {
                ...state,
            };
    }
}

export default AlbumReducer;
