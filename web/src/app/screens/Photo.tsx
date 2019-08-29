import React from 'react';

// UI
import PhotoGrid from '../components/PhotoGrid';
import { notification, Typography } from 'antd';
import 'react-image-lightbox/style.css';

// State
import { handleFetchThumbnails } from '../components/PhotoGrid/photos.hooks';
import { usePhotoContext } from '../contexts/PhotoContext';

// Types
import { ArgsProps } from 'antd/lib/notification';
import { IThumbnail, IPhotoMetadata } from '../interfaces/photos.interface';

const { Paragraph } = Typography;

function PhotoScreen() {
    const { thumbnails, setThumbnails } = usePhotoContext();
    const [loading, setLoading] = React.useState(true);

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
        // TODO: Need a more robust condition to refetch photos
        if (Object.entries(thumbnails).length > 0) return;

        let thumbnailCtr = 0;
        handleFetchThumbnails({
            onStart: (allMetadata: IPhotoMetadata[]) => {
                if (allMetadata === undefined) {
                    return;
                }

                let skeletonThumbnails: { [date: string]: { [photoId: string]: IThumbnail } } = {};
                allMetadata.forEach(meta => {
                    let photoId = meta._id;
                    let dateString = new Date(meta.createdAt).toDateString();
                    let thumbnail: IThumbnail = { b64: '', metaData: meta };
                    skeletonThumbnails[dateString] = skeletonThumbnails[dateString]
                        ? { ...skeletonThumbnails[dateString], ...{ [photoId]: thumbnail } }
                        : { [photoId]: thumbnail };
                });

                console.log({ skeletonThumbnails });

                setThumbnails(skeletonThumbnails);
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
        // eslint-disable-next-line
    }, []);

    return <PhotoGrid loading={loading} thumbnails={thumbnails} />;
}

export default PhotoScreen;
