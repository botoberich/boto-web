import React from 'react';
import PropTypes from 'prop-types';

// UI
import Lightbox from 'react-image-lightbox';
import { Icon } from 'antd';
import { motion } from 'framer-motion';
import styles from './PhotoGridItem.module.css';

// state
import { deleteMiniPhoto } from '../../../services/photo.service';

// Framer animations
const variants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.3,
            staggerChildren: 0.1,
            staggerDirection: 1,
            y: { stiffness: 500 },
        },
    },
    closed: {
        y: 30,
        opacity: 0,
        transition: { staggerChildren: 0.05, y: { stiffness: 500 } },
    },
};

function PhotoGridItem({ deletePhoto, id, photoId, src }) {
    const [isDeleting, setDeleting] = React.useState(false);
    // Quick way to hide deleted photos without refetching all the photos
    const [deleted, setDeleted] = React.useState(false);
    const [isOpen, setOpen] = React.useState(false);
    const [isSelected, setSelected] = React.useState(false);

    const handleDownload = React.useCallback(() => {
        if (isDeleting) return;

        const downloadableImg = document.createElement('a');
        downloadableImg.download = `${id}.jpg`;
        downloadableImg.href = src;
        document.body.appendChild(downloadableImg);
        downloadableImg.click();
        document.body.removeChild(downloadableImg);
    });

    const handleDelete = React.useCallback(() => {
        if (isDeleting) return;

        async function run() {
            try {
                setDeleting(true);
                const res = await deleteMiniPhoto(id);
                console.log({ res });
                if (res.status === 'success') {
                    // Delete photo from DOM. We don't need to refetch all the photos.
                    setDeleted(true);
                    setDeleting(false);
                } else {
                    setDeleting(false);
                }
            } catch (e) {
                setDeleted(false);
                setDeleting(false);
                console.error(`Failed to delete photo ${id}: ${e}`);
            }
        }

        run();
    });

    if (deleted) return null;

    return (
        <div
            className={`${styles.editableContainer} 
                ${isSelected ? styles.editing : ''} 
                ${isDeleting ? styles.deleting : ''}`}
            key={id}>
            <motion.div
                aria-checked={isSelected}
                className={styles.triggerBox}
                onClick={() => setSelected(!isSelected)}
                role="checkbox"
                transition={{
                    duration: 0.133,
                }}>
                <Icon type="check-circle" theme={isSelected ? 'twoTone' : ''} />
            </motion.div>

            <motion.div animate={isSelected ? 'open' : 'closed'} className={styles.editBox} variants={variants}>
                <motion.button
                    aria-label="Download Photo"
                    className={styles.btn}
                    onClick={handleDownload}
                    whileHover={{ scale: 1.1 }}>
                    <Icon type="copy" theme="twoTone" twoToneColor="#52c41a" />
                </motion.button>
                <motion.button
                    aria-label="Delete Photo"
                    className={styles.btn}
                    onClick={handleDelete}
                    whileHover={{ scale: 1.1 }}>
                    <Icon type="delete" theme="twoTone" twoToneColor="#eb2f96" />
                </motion.button>
            </motion.div>

            <div
                onClick={() => setOpen(true)}
                className={`${isSelected ? styles.scaleDown : ''} ${styles.imageContainer}`}>
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
    deletePhoto: PropTypes.func,
};

PhotoGridItem.defaultProps = {
    deletePhoto: () => {},
};

export default PhotoGridItem;
