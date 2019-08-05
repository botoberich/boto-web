import React from 'react';
import PropTypes from 'prop-types';
import styles from './PhotoGrid.module.css';
import PhotoGridItem from './PhotoGridItem';
// import { Skeleton } from 'antd';
import TestImg1 from './testImg1.jpg';

function PhotoGrid({ photos }) {
    return (
        <div className={styles.gridContainer}>
            <div className={styles.grid}>
                {/* {photos.map(({ src, id }) => {
                    if (!src) {
                        return <Skeleton key={id} active></Skeleton>;
                    }
                    return  */}
                    <PhotoGridItem key={51423} src={TestImg1}></PhotoGridItem>
                {/* })} */}
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
