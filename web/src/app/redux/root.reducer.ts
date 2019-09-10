import { combineReducers } from 'redux';
import photoReducer from './photo/photo.reducers';
import albumReducer from './album/album.reducers';

const rootReducer = combineReducers({
    photo: photoReducer,
    album: albumReducer,
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
