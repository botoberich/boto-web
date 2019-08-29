import React from 'react';
import { format, isToday, compareDesc } from 'date-fns';

// UI
import { Skeleton, Typography, Empty } from 'antd';
import PhotoGridItem from './PhotoGridItem';
import styles from './PhotoGrid.module.css';

const { Title } = Typography;

function PhotoGrid({ thumbnails, loading }) {
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
                                <Title level={3}>{isToday(date) ? 'Today' : format(date, 'ddd, D MMM YYYY')}</Title>
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
