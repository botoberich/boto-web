import React from 'react';

// UI
import PhotoGrid from '../Photo/PhotoGrid';
import { notification, Typography } from 'antd';
import 'react-image-lightbox/style.css';

// State
import { handleFetchAlbumThumbnails } from '../Album/albums.hooks';
import { getAlbumById } from '../../services/album.service';
import { usePhotoContext } from '../../contexts/PhotoContext';
import { setAlbumMetaData } from '../../redux/album/album.actions';
import { useDispatch } from 'react-redux';

// Types
import { ArgsProps } from 'antd/lib/notification';
import { IThumbnail, IPhotoMetadata } from '../../interfaces/photos.interface';
import { useServiceContext } from '../../contexts/ServiceContext';

const { Title, Paragraph } = Typography;

function AlbumView({ title, loading, skeleton }) {
    return (
        <>
            <Title>{title}</Title>
            <PhotoGrid skeleton={skeleton} loading={loading}></PhotoGrid>
        </>
    );
}

export default AlbumView;

export function useAlbumView({ albumID }) {
    const [title, setTitle] = React.useState('');
    const { thumbnails, setThumbnails } = usePhotoContext();
    const [loading, setLoading] = React.useState(true);
    const { useServer } = useServiceContext();
    const dispatch = useDispatch();

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

            try {
                const albumRes = await getAlbumById(albumID);

                if (!albumRes) {
                    return;
                }
                
                if (albumRes.status !== 'success') {
                    return;
                }

                console.log({ albumRes });

                dispatch(setAlbumMetaData(albumRes.data.albumMetadata._id, albumRes.data.albumMetadata));

                setTitle(albumRes.data.albumMetadata.title);
                const thumbnailIDs = albumRes.data.photos.map(photo => photo._id);
                let thumbnailCtr = 0;

                subscription = handleFetchAlbumThumbnails(useServer, {
                    thumbnailIDs,
                    onStart: (allMetadata: IPhotoMetadata[]) => {
                        if (allMetadata === undefined) {
                            return;
                        }
                        console.log({ albumID, allMetadata });

                        const thumbnailsByDate: { [date: string]: { [photoId: string]: IThumbnail } } = {};
                        allMetadata.forEach(meta => {
                            const photoId = meta._id;
                            const dateString = new Date(meta.createdAt).toDateString();
                            const thumbnail: IThumbnail = { b64: '', metaData: meta };
                            thumbnailsByDate[dateString] = thumbnailsByDate[dateString]
                                ? { ...thumbnailsByDate[dateString], ...{ [photoId]: thumbnail } }
                                : { [photoId]: thumbnail };
                        });

                        setThumbnails(thumbnailsByDate);
                    },
                    onNext: res => {
                        if (res === null || res === undefined) {
                            return;
                        }
                        thumbnailCtr++;

                        /** hydrate the skeletons with b64 on each emission */
                        setThumbnails(thumbnails => {
                            let dateString = new Date(res.metaData.createdAt).toDateString();
                            let copy = { ...thumbnails };
                            copy[dateString][res.metaData._id].b64 = res.b64;
                            return copy;
                        });
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
    }, [albumID]);

    return { title, thumbnails, loading };
}
