import React from 'react';
import { format, isToday, compareDesc } from 'date-fns';

// UI
import { Skeleton, Typography, Empty, notification } from 'antd';
import PhotoGridItem from './PhotoGridItem';
import styles from './PhotoGrid.module.css';

// State
import { handleFetchThumbnails } from './photos.hooks';
import { useDispatch } from 'react-redux';
import { nextPhoto, setMetaData } from '../../redux/photo/photo.actions';

// Types
import { ArgsProps } from 'antd/lib/notification';
import { IPhotoMetadata } from '../../interfaces/photos.interface';
import { useServiceContext } from '../../contexts/ServiceContext';

const { Title, Paragraph } = Typography;

export function usePhotoGrid() {
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
        // photoCounter tracks the number of photos fetched. users can successfully fetch 0 photos. 
        // if so, we don't want to send them a notification
        let photoCounter = 0;
        const subscription = handleFetchThumbnails(useServer, {
            onStart: (allMetadata: IPhotoMetadata[]) => {
                if (allMetadata === undefined) {
                    return;
                }
                dispatch(setMetaData(allMetadata));
            },
            onNext: res => {
                if (res === null || res === undefined) {
                    return;
                }
                photoCounter++;
                dispatch(nextPhoto(res));
            },
            onError: err => {
                notification.error(notificationConfig(`Unable to fetch photos. Please contact support.`));
            },
            onComplete: () => {
                setLoading(false);
                if (photoCounter !== 0) {
                    notification.success(notificationConfig(`Successfully loaded all photos.`));
                }
            },
        });
        return () => {
            subscription.then(sub => {
                sub.unsubscribe();
            });
        };
    }, [useServer]);

    return {
        loading,
    };
}

function PhotoGrid({ skeleton, loading }) {
    return (
        <div className={styles.gridContainer}>
            {!loading && Object.keys(skeleton).length === 0 && <Empty className={styles.noData} description={<span>No boto 😢</span>}></Empty>}
            {Object.keys(skeleton).length > 0 &&
                Object.keys(skeleton)
                    .sort(compareDesc)
                    .map(date => {
                        return (
                            <div key={date}>
                                <Title level={3}>{isToday(date) ? 'Today' : format(date, 'ddd, D MMM YYYY')}</Title>
                                <div className={styles.grid}>
                                    {Object.keys(skeleton[date]).map(photoId => {
                                        let b64 = skeleton[date][photoId].b64;
                                        if (!b64) {
                                            return <Skeleton key={photoId} active />;
                                        }
                                        return <PhotoGridItem id={photoId} key={photoId} src={`data:image/png;base64,${b64}`} />;
                                    })}
                                </div>
                            </div>
                        );
                    })}
        </div>
    );
}

export default PhotoGrid;
