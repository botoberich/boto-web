import React from 'react';
import PropTypes from 'prop-types';
import styles from './PhotoGrid.module.css';
import PhotoGridItem from './PhotoGridItem';
import { Skeleton } from 'antd';
// import TestImg1 from './testImg1.jpg';

function PhotoGrid({ photos, deletePhoto, downloadComplete }) {
    return (
        <div className={styles.gridContainer}>
            <div className={styles.grid}>
                {photos.map(({ src, id, photoId }) => {
                    if (!src && downloadComplete) {
                        return null;
                    }
                    if (!src) {
                        return <Skeleton key={id} active></Skeleton>;
                    }
                    return (
                        <PhotoGridItem
                            deletePhoto={deletePhoto}
                            id={id}
                            key={id}
                            photoId={photoId}
                            src={src}></PhotoGridItem>
                    );
                })}
            </div>
        </div>
    );
}

PhotoGrid.propTypes = {
    photos: PropTypes.array,
    deletePhoto: PropTypes.func,
};

PhotoGrid.defaultProps = {
    photos: [],
    deletePhoto: () => {},
};

export default PhotoGrid;
