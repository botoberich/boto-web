import React from 'react';
import PropTypes from 'prop-types';
import styles from './PhotoGrid.module.css';
import PhotoGridItem from './PhotoGridItem';
// import { Skeleton } from 'antd';
import PhotoWorker from '../../screens/photo.worker';
import { Skeleton } from 'antd';

const worker = typeof window === 'object' && PhotoWorker();

async function PhotoGrid({ photos }) {
    let newPhotos = null;
    if (worker) {
        // setNewPhotos(newPhotos);
        newPhotos = await worker.fromValues(photos);
        return (
            <div className={styles.gridContainer}>
                <div className={styles.grid}>
                    {newPhotos.map(({ src, id }) => {
                        if (!src) {
                            return <Skeleton></Skeleton>;
                        }
                        return <PhotoGridItem key={id} src={src}></PhotoGridItem>;
                    })}
                </div>
            </div>
        );
    }

    console.log('worker photogrid photos', newPhotos);

    return null;
}

PhotoGrid.propTypes = {
    photos: PropTypes.array,
};

PhotoGrid.defaultProps = {
    photos: [],
};

export default PhotoGrid;
