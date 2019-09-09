import { createSelector } from 'reselect';
import { IThumbnail } from '../../interfaces/photos.interface';

const albumSkeletonMetaSelector = (state, albumId) => {
    if (state.album.albums[albumId]) {
        return state.album.albums[albumId].photoMetadata;
    }
};

const albumPhotosSelector = (state, albumId) => {
    if (state.album.albums[albumId]) {
        return state.album.albums[albumId].photos;
    }
};

export const albumSkeletonSelector = createSelector(
    albumSkeletonMetaSelector,
    albumPhotosSelector,
    (metaData, photos) => {
        if (!metaData || !photos) {
            return;
        }

        const skeletonThumbnails: { [date: string]: { [photoId: string]: IThumbnail } } = {};

        // Fill the skeleton with our metadata
        metaData.forEach(meta => {
            const dateCreated = new Date(meta.createdAt).toDateString();
            const thumbnail: IThumbnail = { b64: '', metaData: meta };
            skeletonThumbnails[dateCreated] = skeletonThumbnails[dateCreated]
                ? { ...skeletonThumbnails[dateCreated], ...{ [meta._id]: thumbnail } }
                : { [meta._id]: thumbnail };
        });

        // Map each photo to their corresponding creation date and id
        photos.forEach(photo => {
            const dateCreated = new Date(photo.metaData.createdAt).toDateString();
            skeletonThumbnails[dateCreated][photo.metaData._id].b64 = photo.b64;
        });

        return skeletonThumbnails;
    }
);
