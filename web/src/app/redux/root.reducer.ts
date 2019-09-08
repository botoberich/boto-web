import { combineReducers } from 'redux';
import photoReducer from './photo/photo.reducers';

const rootReducer = combineReducers({
    photo: photoReducer,
});

export default rootReducer

export type AppState = ReturnType<typeof rootReducer>
