import React from 'react';
import { format, isToday, compareDesc } from 'date-fns';

// UI
import { Skeleton, Typography, Empty, notification } from 'antd';
import PhotoGridItem from './PhotoGridItem';
import styles from './PhotoGrid.module.css';

// State
import { handleFetchThumbnails } from './photos.hooks';
import { usePhotoContext } from '../../contexts/PhotoContext';

// Types
import { ArgsProps } from 'antd/lib/notification';
import { IThumbnail, IPhotoMetadata } from '../../interfaces/photos.interface';
import { useServiceContext } from '../../contexts/ServiceContext';

const { Title, Paragraph } = Typography;

export function usePhotoGrid() {
    const { thumbnails, setThumbnails } = usePhotoContext();
    const [loading, setLoading] = React.useState(true);
    const { useServer } = useServiceContext();

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
        let thumbnailCtr = 0;
        const subscription = handleFetchThumbnails(useServer, {
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
        return () => {
            // State is being cached for some reason after page.
            // Example: The last fetch call is storing the set of thumbnails,
            // even page Photo screen and Detailed Album screen
            // Will refactor state management later, using context or mobx
            subscription.then(sub => {
                sub.unsubscribe();
                setThumbnails({});
            });
        };
        // eslint-disable-next-line
    }, [useServer]);

    return {
        thumbnails,
        loading,
    };
}

function PhotoGrid({ thumbnails, loading }) {
    return (
        <div className={styles.gridContainer}>
            {!loading && Object.keys(thumbnails).length === 0 && <Empty className={styles.noData} description={<span>No boto 😢</span>}></Empty>}
            {Object.keys(thumbnails).length > 0 &&
                Object.keys(thumbnails)
                    .sort(compareDesc)
                    .map(date => {
                        return (
                            <div key={date}>
                                <Title level={3}>{isToday(date) ? 'Today' : format(date, 'ddd, D MMM YYYY')}</Title>
                                <div className={styles.grid}>
                                    {Object.keys(thumbnails[date]).map(photoId => {
                                        let b64 = thumbnails[date][photoId].b64;
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
