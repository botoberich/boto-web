import React from 'react';
import { format, isToday, compareDesc } from 'date-fns';

// UI
import { Skeleton, notification, Typography, Empty } from 'antd';
import { ArgsProps } from 'antd/lib/notification';
import PhotoGridItem from './PhotoGridItem';
import styles from './PhotoGrid.module.css';

// State
import { handleFetchThumbnails } from '../../hooks/photos.hooks';
import { usePhotoContext } from '../../contexts/PhotoContext';

// Types
import { IThumbnail, IPhotoMetadata } from '../../interfaces/photos.interface';

const { Title } = Typography;
const { Paragraph } = Typography;

function PhotoGrid() {
    const { thumbnails, setThumbnails } = usePhotoContext();
    const [loading, setLoading] = React.useState(true);

    const notificationConfig = (msg: string): ArgsProps => ({
        /** @todo we need to find a better way to display notifications globally through out the app */
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
    }, [setThumbnails, thumbnails]);

    return (
        <div className={styles.gridContainer}>
            {!loading && Object.keys(thumbnails).length === 0 && (
                <Empty className={styles.noData} description={<span>No boto 😢</span>}></Empty>
            )}
            {Object.keys(thumbnails).length > 0 &&
                Object.keys(thumbnails)
                    .sort(compareDesc)
                    .map(date => {
                        return (
                            <div key={date}>
                                <Title level={3}>{isToday(date) ? 'Today' : format(date, 'D MMM YYYY')}</Title>
                                <div className={styles.grid}>
                                    {Object.keys(thumbnails[date]).map(photoId => {
                                        let b64 = thumbnails[date][photoId].b64;
                                        if (!b64) {
                                            return <Skeleton key={photoId} active />;
                                        }
                                        return (
                                            <PhotoGridItem
                                                id={photoId}
                                                key={photoId}
                                                src={`data:image/png;base64,${b64}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
        </div>
    );
}

export default PhotoGrid;
