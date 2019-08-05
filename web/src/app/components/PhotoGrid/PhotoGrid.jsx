import React from 'react';
import PropTypes from 'prop-types';
import styles from './PhotoGrid.module.css';
import PhotoGridItem from './PhotoGridItem';
// import { Skeleton } from 'antd';
import TestImg1 from './testImg1.jpg';

function PhotoGrid({ photos, deletePhoto }) {
    return (
        <div className={styles.gridContainer}>
            <div className={styles.grid}>
                {/* {photos.map(({ src, id }) => {
                    if (!src) {
                        return <Skeleton key={id} active></Skeleton>;
                    }
                    return  */}
                <PhotoGridItem deletePhoto={deletePhoto} key={51423} src={TestImg1}></PhotoGridItem>
                {/* })} */}
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
