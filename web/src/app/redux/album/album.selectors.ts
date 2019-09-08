import { createSelector } from 'reselect';

const albumSelector = (state, albumId) => state.album.albums[albumId];

export const albumSkeletonSelector = createSelector(
    albumSelector,
    album => {
        console.log('slector album', album);
        return album;
    }
);
