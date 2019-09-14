import React from 'react';

// UI
import PhotoGrid from '../Photo/PhotoGrid';
import 'react-image-lightbox/style.css';

// State
import { handleFetchAlbumThumbnails } from '../Album/albums.hooks';
import { getAlbumById } from '../../services/album.service';
import { setAlbumMetaData, setAlbumPhotoMetaData, nextAlbumPhoto } from '../../redux/album/album.actions';
import { useDispatch, useSelector } from 'react-redux';
import { albumSkeletonSelector, albumSelector } from '../../redux/album/album.selectors';

// Types
import { IPhotoMetadata } from '../../interfaces/photos.interface';
import { useServiceContext } from '../../contexts/ServiceContext';
import { notifyError } from '../../utils/notification';
import { useHeaderContext } from '../../contexts/HeaderContext';

function AlbumView({ loading, skeleton, albumId }) {
    return <>{skeleton && <PhotoGrid skeleton={skeleton} loading={loading} parent="album" albumId={albumId}></PhotoGrid>}</>;
}

export default AlbumView;

export function useAlbumView({ albumID }) {
    const dispatch = useDispatch();
    const { useServer } = useServiceContext();
    const { setHeaderTitle } = useHeaderContext();
    const [loading, setLoading] = React.useState(true);

    const title = useSelector(state => {
        const album = albumSelector(state, albumID);
        if (album) {
            return album.title;
        }
        return '';
    });

    setHeaderTitle(`Album ${title ? `| ${title}` : ''}`);

    const skeleton = useSelector(state => {
        return albumSkeletonSelector(state, albumID);
    });

    React.useEffect(() => {
        let subscription;

        async function fetch() {
            if (albumID === null) {
                return;
            }

            try {
                const albumRes = await getAlbumById(albumID);

                if (!albumRes) {
                    return;
                }

                if (albumRes.status !== 'success') {
                    // Potential spot to retry and notify user
                    return;
                }

                // To minimize the need to fetch the album view, we count the number of photos in Redux
                // and compare it to the newly fetched album's metadata
                let currentPhotoCount = 0;

                if (skeleton) {
                    Object.values(skeleton).forEach(date => {
                        currentPhotoCount += Object.values(date).length;
                    });
                }

                if (currentPhotoCount !== 0 && currentPhotoCount === albumRes.data.photos.length) {
                    return;
                }

                // Prep the metadata to set up initial skeleton
                dispatch(setAlbumMetaData(albumRes.data.albumMetadata._id, albumRes.data.albumMetadata));

                // Collect ids to retrieve the photo thumbnails
                const thumbnailIDs = albumRes.data.photos.map(photo => photo._id);
                let thumbnailCtr = 0;

                subscription = handleFetchAlbumThumbnails(useServer, {
                    thumbnailIDs,
                    onStart: (photosMetadata: IPhotoMetadata[]) => {
                        if (photosMetadata === undefined) {
                            return;
                        }
                        dispatch(setAlbumPhotoMetaData(albumRes.data.albumMetadata._id, photosMetadata));
                    },
                    onNext: res => {
                        if (res === null || res === undefined) {
                            return;
                        }
                        dispatch(nextAlbumPhoto(albumRes.data.albumMetadata._id, res));
                        thumbnailCtr++;
                    },
                    onError: err => {
                        notifyError(`Unable to fetch photos. Please contact support.`);
                    },
                    onComplete: () => {
                        setLoading(false);
                    },
                });
            } catch (err) {
                console.log(err);
            }
        }

        fetch();

        return () => {
            if (subscription) {
                subscription.then(sub => {
                    sub.unsubscribe();
                });
            }
        };
    }, [albumID, loading, title]);

    return { skeleton, loading };
}
