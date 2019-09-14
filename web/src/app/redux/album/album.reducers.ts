import { IAlbumMetadata } from '../../interfaces/albums.interface';
import { IThumbnail, IPhotoMetadata } from '../../interfaces/photos.interface';
import { NEXT_ALBUM_PHOTO, SET_ALBUM_METADATA, SET_ALBUMS_METADATA, SET_ALBUM_PHOTO_METADATA, REMOVE_ALBUM_PHOTO } from './album.actions';

// Reducer
interface AlbumReducerState {
    albums: {
        [id: string]: IAlbumMetadata;
    };
    source: {
        [id: string]: {
            photos: IThumbnail[];
            photoMetadata: IPhotoMetadata[];
        };
    };
}

const INITIAL_STATE = {
    albums: {}, // Stores the album metadata by album ID
    source: {}, // Stores the photos and photo metadata relevant to the album
};

function AlbumReducer(state = INITIAL_STATE, action): AlbumReducerState {
    switch (action.type) {
        case SET_ALBUMS_METADATA: {
            return {
                ...state,
                albums: action.payload.albums,
            };
        }
        case SET_ALBUM_METADATA: {
            const albums = {
                ...state.albums,
                [action.payload.albumID]: action.payload.metadata,
            };
            const source = {
                ...state.source,
                [action.payload.albumID]: {
                    photos: [],
                    photoMetadata: [],
                },
            };
            return {
                ...state,
                source,
                albums,
            };
        }
        case SET_ALBUM_PHOTO_METADATA: {
            const source = {
                ...state.source,
            };

            if (source[action.payload.albumID]) {
                source[action.payload.albumID].photoMetadata = action.payload.metadata;
            }

            return {
                ...state,
                source,
            };
        }
        case NEXT_ALBUM_PHOTO: {
            const source = {
                ...state.source,
            };

            if (source[action.payload.albumID]) {
                source[action.payload.albumID].photos = [...source[action.payload.albumID].photos, action.payload.photo];
            }

            return {
                ...state,
                source,
            };
        }
        case REMOVE_ALBUM_PHOTO: {
            const source = {
                ...state.source,
            };

            const albumSource = source[action.payload.albumID];

            if (albumSource) {
                action.payload.photoIDs.forEach(id => {
                    albumSource.photos = albumSource.photos.filter(photo => photo.metaData._id !== id);
                    albumSource.photoMetadata = albumSource.photoMetadata.filter(photoMeta => photoMeta._id !== id);
                });
            }

            return {
                ...state,
                source,
            };
        }
        default:
            return {
                ...state,
            };
    }
}

export default AlbumReducer;
