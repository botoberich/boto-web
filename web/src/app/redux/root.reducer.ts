import { combineReducers } from 'redux';
import photoReducer from './photo/photo.reducer';

export default combineReducers({
    photo: photoReducer,
});
