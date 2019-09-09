import { IAlbumMetadata } from '../../interfaces/albums.interface';
import { IThumbnail, IPhotoMetadata } from '../../interfaces/photos.interface';
import { NEXT_ALBUM_PHOTO, SET_ALBUM_METADATA, SET_ALBUM_PHOTO_METADATA } from './album.actions';

// Reducer
interface AlbumReducerState {
    albums: {
        [id: string]: {
            photos: IThumbnail[];
            albumMetadata: IAlbumMetadata;
            photoMetadata: IPhotoMetadata[];
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
                    photoMetadata: [],
                },
            };
            return {
                ...state,
                albums,
            };
        }
        case SET_ALBUM_PHOTO_METADATA: {
            const albums = {
                ...state.albums,
            };

            if (albums[action.payload.albumID]) {
                albums[action.payload.albumID].photoMetadata = action.payload.metadata;
            }

            return {
                ...state,
                albums,
            };
        }
        case NEXT_ALBUM_PHOTO: {
            const albums = {
                ...state.albums,
            };

            if (albums[action.payload.albumID]) {
                albums[action.payload.albumID].photos = [...albums[action.payload.albumID].photos, action.payload.photo];
            }

            return {
                ...state,
                albums: {
                    ...albums,
                },
            };
        }
        default:
            return {
                ...state,
            };
    }
}

export default AlbumReducer;
