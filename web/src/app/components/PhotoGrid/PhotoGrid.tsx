import React from 'react';

// UI
import { Skeleton } from 'antd';
import PhotoGridItem from './PhotoGridItem';
import styles from './PhotoGrid.module.css';

// Types
import { useGetThumbnails } from '../../hooks/photos.hooks';

function PhotoGrid() {
    const { data: photos, error, loading } = useGetThumbnails();

    return (
        <div className={styles.gridContainer}>
            <div className={styles.grid}>
                {photos.map(({ src, id }) => {
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
