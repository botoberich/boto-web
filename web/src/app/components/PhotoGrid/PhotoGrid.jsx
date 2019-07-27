import React from 'react';
import PropTypes from 'prop-types';
import styles from './PhotoGrid.module.css';
import PhotoGridItem from './PhotoGridItem';
import TestImage1 from './testImg1.jpg';
import TestImage2 from './testImg2.jpg';
import TestImage3 from './testImg3.jpg';

function PhotoGrid({ photos }) {
    photos = [
        {
            src: TestImage1,
            b64: 'asdfasf65vea',
        },
        {
            src: TestImage2,
            b64: 'asdfasfaasd98vea',
        },
        {
            src: TestImage3,
            b64: 'asdf123sdfczvea',
        },
    ];
    console.log({ photos });
    return (
        <div className={styles.gridContainer}>
            <div className={styles.grid}>
                {photos || photos.length > 0
                    ? photos.map(({ src, b64 }, i) => {
                          return <PhotoGridItem key={b64.slice(0, 10) + i} src={src} b64={b64} i={i}></PhotoGridItem>;
                      })
                    : null}
            </div>
        </div>
    );
}

PhotoGrid.propTypes = {
    photos: PropTypes.array,
};

export default PhotoGrid;
