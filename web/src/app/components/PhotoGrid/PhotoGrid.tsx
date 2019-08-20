import React from 'react';
<<<<<<< HEAD
import { format, isToday, compareDesc } from 'date-fns';
=======
import { format } from 'date-fns';
>>>>>>> 1d6fe029a795f339e1d824a3887f06e86e5f85b2

// UI
import { Skeleton, notification, Typography } from 'antd';
import { ArgsProps } from 'antd/lib/notification';
import PhotoGridItem from './PhotoGridItem';
import styles from './PhotoGrid.module.css';

// Types
import { handleFetchThumbnails } from '../../hooks/photos.hooks';
import { usePhotoContext } from '../../contexts/PhotoContext';
import { Thumbnail } from '../../interfaces/photos.interface';

const { Title } = Typography;

function PhotoGrid() {
    const { thumbnails, setThumbnails, loadingLightBox } = usePhotoContext();
    const { Paragraph } = Typography;
    const notificationConfig = (msg: string): ArgsProps => ({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: (
            <div>
                <Paragraph>{msg}</Paragraph>
            </div>
        ),
    });

    React.useEffect(() => {
        let allThumbnails: Thumbnail[] = [];
        handleFetchThumbnails({
            onNext: res => {
                console.log(res);
                if (res === null || res === undefined) {
                    return;
                }
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
                notification.success(notificationConfig(`Successfully loaded all photos.`));
            },
        });
    }, [setThumbnails]);

    return (
        <div className={styles.gridContainer}>
            {Object.keys(thumbnails)
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
