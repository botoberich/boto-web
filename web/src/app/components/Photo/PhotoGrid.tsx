import React from 'react';
import { format, isToday, compareDesc } from 'date-fns';

// UI
import { Skeleton, Typography, Empty, notification, Button, Icon } from 'antd';
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
import { notifyError, notifySuccess, notifyInfo } from '../../utils/notification';
import { navigate } from 'gatsby';

const { Title, Paragraph } = Typography;

export function usePhotoGrid() {
    const [loading, setLoading] = React.useState(true);
    const { useServer } = useServiceContext();
    const dispatch = useDispatch();

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
                notifyError(`Unable to fetch photos. Please contact support.`);
            },
            onComplete: () => {
                setLoading(false);
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

function PhotoGrid({ skeleton, loading, parent = '', albumId = '' }) {
    return (
        <div className={styles.gridContainer}>
            {!loading && Object.keys(skeleton).length === 0 && (
                <Empty className={styles.noData} description={<span>No boto 😢</span>}>
                    {parent === 'album' && (
                        <Button
                            onClick={() => {
                                navigate(`/app/albums/add/${albumId}`);
                            }}
                            type="primary">
                            <Icon type="picture" />
                            Add Photos
                        </Button>
                    )}
                </Empty>
            )}
            {Object.keys(skeleton).length > 0 &&
                Object.keys(skeleton)
                    .sort(compareDesc)
                    .map(date => {
                        return (
                            <div key={date}>
                                <Title className={styles.date} level={3}>
                                    {isToday(date) ? 'Today' : format(date, 'ddd, D MMM YYYY')}
                                </Title>
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
