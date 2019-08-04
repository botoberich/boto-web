import React from 'react';
import PropTypes from 'prop-types';
import styles from './PhotoGrid.module.css';
import PhotoGridItem from './PhotoGridItem';
import { Skeleton } from 'antd';

function PhotoGrid({ photos }) {
    return (
        <div className={styles.gridContainer}>
            <div className={styles.grid}>
                {photos.map(({ src, id }) => {
                    if (!src) {
                        return null;
                    }
                    return <PhotoGridItem key={id} src={src}></PhotoGridItem>;
                })}
            </div>
        </div>
    );
}

PhotoGrid.propTypes = {
    photos: PropTypes.array,
};

PhotoGrid.defaultProps = {
    photos: [],
};

export default PhotoGrid;
