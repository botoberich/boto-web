import React from 'react';

// UI
import Lightbox from 'react-image-lightbox';
import { Icon, Progress } from 'antd';
import { motion } from 'framer-motion';
import styles from './PhotoGridItem.module.css';

// state
import { handleDeletePhotos } from '../../../hooks/photos.hooks';
import { getPhotoById } from '../../../services/photo.service';
import { usePhotoContext } from '../../../contexts/ProgressContext';

// Framer animations
const variants = {
    open: {
        y: 0,
        opacity: 1,
    },
    closed: {
        y: 30,
        opacity: 0,
        transition: { staggerChildren: 0.05, y: { stiffness: 500 } },
    },
};

const TIME_TO_DOWNLOAD = 300;

function PhotoGridItem({ id, src }) {
    const progressCtx = usePhotoContext();
    console.log({ progressCtx });
    // Cool, you got notification, now create hook completion rate into progress somehow
    // Message: Show progress bar
    // Description: Display number of items completed

    progressCtx.notify({
        message: (
            <div>
                Message<Progress percent={50}></Progress>
            </div>
        ),
        description: (
            <div>
                Description<Progress percent={100}></Progress>
            </div>
        ),
        onClick: () => {
            console.log('Notification Clicked!');
        },
        duration: 0,
    });

    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [deleted, setDeleted] = React.useState(false);
    const [deleteError, setDeleteError] = React.useState(null);
    const [photoDownloading, setPhotoDownloading] = React.useState(false);
    const originalSrc = React.useRef('');
    const timeoutId = React.useRef(null);

    const handlePhotoDownload = React.useCallback(async () => {
        // This fetch can be triggered on click or on mouse hover. Make sure it's only ever triggered once
        if (originalSrc.current === '' && photoDownloading === false) {
            setPhotoDownloading(true);
            const photo = await getPhotoById(id);
            if (photo.status === 'success') {
                // eslint-disable-next-line
                originalSrc.current = `data:image/png;base64,${photo.data.b64}`;
            }
            setPhotoDownloading(false);
        }
    }, [id, photoDownloading]);

    const handleDownload = React.useCallback(async () => {
        if (deleting) return;
        if (photoDownloading) return;
        const downloadableImg = document.createElement('a');
        downloadableImg.download = `${id}.jpg`;
        downloadableImg.href = originalSrc.current;
        document.body.appendChild(downloadableImg);
        downloadableImg.click();
        document.body.removeChild(downloadableImg);
    }, [deleting, id, photoDownloading]);

    const handleDelete = React.useCallback(() => {
        handleDeletePhotos([id], {
            onLoading: loading => setDeleting(loading),
            onError: err => setDeleteError(err),
            onComplete: () => setDeleted(true),
        });
    }, [id]);

    if (deleted) return null;

    return (
        <div
            className={`${styles.editableContainer} 
                ${selected ? styles.editing : ''} 
                ${deleting ? styles.deleting : ''}`}
            key={id}
            onClick={handlePhotoDownload}
            onTouchStart={() => {
                timeoutId.current = setTimeout(() => {
                    handlePhotoDownload();
                }, TIME_TO_DOWNLOAD);
            }}
            onMouseOver={() => {
                timeoutId.current = setTimeout(() => {
                    handlePhotoDownload();
                }, TIME_TO_DOWNLOAD);
            }}
            onMouseLeave={() => {
                clearTimeout(timeoutId.current);
            }}>
            <motion.div
                aria-checked={selected}
                className={styles.triggerBox}
                onClick={() => setSelected(!selected)}
                role="checkbox"
                transition={{
                    duration: 0.133,
                }}>
                <Icon type="check-circle" theme={selected ? 'twoTone' : 'outlined'} />
            </motion.div>
            <motion.div animate={selected ? 'open' : 'closed'} className={styles.editBox} variants={variants}>
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
                className={`${selected ? styles.scaleDown : ''} ${styles.imageContainer}`}>
                <div
                    aria-label={`PhotoId: ${id}`}
                    className={styles.img}
                    style={{
                        backgroundImage: `url("${src}")`,
                    }}
                />
                {open && <Lightbox mainSrc={originalSrc.current} onCloseRequest={() => setOpen(false)} />}
            </div>
            {(deleting || photoDownloading) && (
                <div className={styles.inProgress}>
                    <Icon type="loading" spin />
                </div>
            )}
            <div className={styles.hoverOverlay} />
        </div>
    );
}

export default PhotoGridItem;
