import React from 'react';
import { format, isToday, compareDesc } from 'date-fns';

// UI
import { Skeleton, notification, Typography, Empty } from 'antd';
import { ArgsProps } from 'antd/lib/notification';
import PhotoGridItem from './PhotoGridItem';
import styles from './PhotoGrid.module.css';

// Types
import { handleFetchThumbnails } from '../../hooks/photos.hooks';
import { usePhotoContext } from '../../contexts/PhotoContext';
import { Thumbnail } from '../../interfaces/photos.interface';

const { Title } = Typography;

function PhotoGrid() {
    const { thumbnails, setThumbnails } = usePhotoContext();
    const [loading, setLoading] = React.useState(true);
    const { Paragraph } = Typography;
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
        let thumbnailCtr = 0;
        handleFetchThumbnails({
            onNext: res => {
                if (res === null || res === undefined) {
                    return;
                }
                thumbnailCtr++;
                setThumbnails(thumbnails => {
                    let dateString = new Date(res.metaData.createdAt).toDateString();
                    let copy = { ...thumbnails };
                    copy[dateString] = copy[dateString] ? [...copy[dateString], res] : [res];
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
    }, []);

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
                                    {thumbnails[date].map(({ b64, photoId }) => {
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
