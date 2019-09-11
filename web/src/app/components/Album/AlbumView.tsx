import React from 'react';

// UI
import PhotoGrid from '../Photo/PhotoGrid';
import { notification, Typography } from 'antd';
import 'react-image-lightbox/style.css';

// State
import { handleFetchAlbumThumbnails } from '../Album/albums.hooks';
import { getAlbumById } from '../../services/album.service';
import { setAlbumMetaData, setAlbumPhotoMetaData, nextAlbumPhoto } from '../../redux/album/album.actions';
import { useDispatch, useSelector } from 'react-redux';
import { albumSkeletonSelector } from '../../redux/album/album.selectors';

// Types
import { ArgsProps } from 'antd/lib/notification';
import { IPhotoMetadata } from '../../interfaces/photos.interface';
import { useServiceContext } from '../../contexts/ServiceContext';

const { Title, Paragraph } = Typography;

function AlbumView({ title, loading, skeleton }) {
    return (
        <>
            <Title>{title}</Title>
            {skeleton && <PhotoGrid skeleton={skeleton} loading={loading}></PhotoGrid>}
        </>
    );
}

export default AlbumView;

export function useAlbumView({ albumID }) {
    const dispatch = useDispatch();
    const { useServer } = useServiceContext();
    const [title, setTitle] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const skeleton = useSelector(state => {
        return albumSkeletonSelector(state, albumID);
    });

    const notificationConfig = (msg: string): ArgsProps => ({
        // TODO: Refactor to use a global navigation singleton
        placement: 'bottomRight',
        bottom: 50,
        duration: 3,
        message: (
            <div>
                <Paragraph>{msg}</Paragraph>
            </div>
        ),
    });

    React.useEffect(() => {
        let subscription;

        async function fetch() {
            if (albumID === null) {
                return;
            }

            if (skeleton) {
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

                // Prep the metadata to set up initial skeleton
                dispatch(setAlbumMetaData(albumRes.data.albumMetadata._id, albumRes.data.albumMetadata));

                // Set the album title
                setTitle(albumRes.data.albumMetadata.title);

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
                        notification.error(notificationConfig(`Unable to fetch photos. Please contact support.`));
                    },
                    onComplete: () => {
                        setLoading(false);
                        if (thumbnailCtr !== 0) {
                            notification.success(notificationConfig(`Successfully loaded all photos.`));
                        }
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
    }, [albumID, loading]);

    return { title, skeleton, loading };
}
