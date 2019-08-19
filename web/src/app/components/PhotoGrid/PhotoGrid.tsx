import React from 'react';

// UI
import { Skeleton, notification, Typography } from 'antd';
import PhotoGridItem from './PhotoGridItem';
import styles from './PhotoGrid.module.css';

// Types
import { useGetThumbnails, handleFetchThumbnails } from '../../hooks/photos.hooks';
import { usePhotoContext } from '../../contexts/PhotoContext';

function PhotoGrid() {
    const { thumbnails, setThumbnails } = usePhotoContext();
    const { Paragraph } = Typography;
    const notificationConfig = msg => ({
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
        handleFetchThumbnails({
            onNext: res => {
                setThumbnails(thumbnails => [
                    ...thumbnails,
                    {
                        id: res.photoId,
                        src: `data:image/png;base64,${res.b64}`,
                    },
                ]);
            },
            onError: err => {
                notification.error(notificationConfig(`Unable to fetch photos. Please contact support.`));
            },
            onComplete: () => {
                notification.success(notificationConfig(`Successfully loaded all photos.`));
            },
        });
    }, []);

    return (
        <div className={styles.gridContainer}>
            <div className={styles.grid}>
                {thumbnails.map(({ src, id }) => {
                    if (!src && loading === false) {
                        return null;
                    }
                    if (!src) {
                        return <Skeleton key={id} active />;
                    }
                    return <PhotoGridItem id={id} key={id} src={src} />;
                })}
            </div>
        </div>
    );
}

export default PhotoGrid;
