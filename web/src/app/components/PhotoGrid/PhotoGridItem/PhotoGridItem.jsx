import React from 'react';
import PropTypes from 'prop-types';

// UI
import Lightbox from 'react-image-lightbox';
import { Icon } from 'antd';

import styles from './PhotoGridItem.module.css';

function PhotoGridItem({ src, id, downloadPhoto, deletePhoto }) {
    const [isDeleting, setDeleting] = React.useState(false);
    const [deleted, setDeleted] = React.useState(false); // Quick way to hide deleted photos
    const [isOpen, setOpen] = React.useState(false);
    const [isEdit, setEdit] = React.useState(false);

    const handleDelete = React.useCallback(() => {
        if (isDeleting) return;

        async function run() {
            try {
                setDeleting(true);
                const { status, data } = await deletePhoto(id);
                if (status === 'success') {
                    // await new Promise((resolve, reject) => {
                    //     setTimeout(() => {
                    //         reject(new Error('failed'));
                    //     }, 1000);
                    // });
                    // Delete photo from DOM
                    console.log(`Photo ${id} deleted successfully`);
                    setDeleted(true);
                    setDeleting(false);
                } else {
                    setDeleting(false);
                }

                console.log({ status, data });
            } catch (e) {
                setDeleted(false);
                setDeleting(false);
                console.error(`Failed to delete photo ${id}: ${e}`);
            }
        }

        run();
    });

    const handleDownload = React.useCallback(() => {
        console.log('downloading photo');
    });

    if (deleted) {
        return null;
    }

    return (
        <div
            className={`${styles.editableContainer} 
                ${isEdit ? styles.editing : ''} 
                ${isDeleting ? styles.deleting : ''}`}
            key={id}>
            <div role="checkbox" aria-checked={isEdit} className={styles.triggerBox} onClick={() => setEdit(!isEdit)}>
                <Icon type="check-circle" theme={isEdit ? 'twoTone' : ''} />
            </div>

            <div className={styles.editBox}>
                <button className={styles.btn} aria-label="Download Photo" onClick={handleDownload}>
                    <Icon type="copy" theme="twoTone" twoToneColor="#52c41a" />
                </button>
                <button className={styles.btn} aria-label="Delete Photo" onClick={handleDelete}>
                    <Icon type="delete" theme="twoTone" twoToneColor="#eb2f96" />
                </button>
            </div>

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

            {isDeleting && (
                <div className={styles.inProgress}>
                    <Icon type="loading" spin />
                </div>
            )}

            <div className={styles.hoverOverlay}></div>
        </div>
    );
}

PhotoGridItem.propTypes = {
    downloadPhoto: PropTypes.func,
    deletePhoto: PropTypes.func,
};

PhotoGridItem.defaultProps = {
    downloadPhoto: () => {},
    deletePhoto: () => {},
};

export default PhotoGridItem;
