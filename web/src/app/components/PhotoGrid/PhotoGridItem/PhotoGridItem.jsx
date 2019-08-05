import React, { useState } from 'react';
import PropTypes from 'prop-types';

// UI
import Lightbox from 'react-image-lightbox';
import { Icon, Skeleton } from 'antd';
import styles from './PhotoGridItem.module.css';

function PhotoGridItem({ src, id, handleDownload, handleDelete }) {
    const [isOpen, setOpen] = useState(false);
    const [isEdit, setEdit] = useState(false);
    return (
        <div className={`${styles.editableContainer} ${isEdit ? styles.editing : ''}`} key={id}>
            <div role="checkbox" aria-checked={isEdit} className={styles.triggerBox} onClick={() => setEdit(!isEdit)}>
                <Icon type="check-circle" theme={isEdit ? 'twoTone' : ''} />
            </div>
            <div className={styles.editBox}>
                <button className={`${styles.btn}`} aria-label="Download Photo">
                    <Icon type="copy" theme="twoTone" twoToneColor="#52c41a" />
                </button>
                <button className={`${styles.btn}`} aria-label="Delete Photo">
                    <Icon type="delete" theme="twoTone" twoToneColor="#eb2f96" />
                </button>
            </div>
            <div className={styles.hoverOverlay}></div>
            <div onClick={() => setOpen(true)} className={`${isEdit ? styles.scaleDown : ''} ${styles.imageContainer}`}>
                <div
                    aria-label={`PhotoId: ${id}`}
                    className={styles.img}
                    style={{
                        backgroundImage: `url("${src}")`,
                    }}
                />
                {isOpen && <Lightbox mainSrc={src} onCloseRequest={() => setOpen(false)} />}
            </div>
        </div>
    );
}

PhotoGridItem.propTypes = {
    handleDownload: PropTypes.func,
    handleDelete: PropTypes.func,
};

PhotoGridItem.defaultProps = {
    handleDownload: () => {},
    handleDelete: () => {},
};

export default PhotoGridItem;
