import React from 'react';

// UI
import Lightbox from 'react-image-lightbox';
import { Icon } from 'antd';
import { motion } from 'framer-motion';
import styles from './PhotoGridItem.module.css';

// state
import { useDeletePhotos } from '../../../hooks/photos.hooks';

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

function PhotoGridItem({ id, src }) {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [deleted, setDeleted] = React.useState(false);

    const handleDownload = React.useCallback(() => {
        if (deleting) return;

        const downloadableImg = document.createElement('a');
        downloadableImg.download = `${id}.jpg`;
        downloadableImg.href = src;
        document.body.appendChild(downloadableImg);
        downloadableImg.click();
        document.body.removeChild(downloadableImg);
    }, [deleting, id, src]);

    const handleDelete = React.useCallback(() => {
        const { success, error, loading } = useDeletePhotos([id]);
        setDeleted(success);
        setDeleting(loading);
    }, [id]);

    if (deleted) return null;

    return (
        <div
            className={`${styles.editableContainer} 
                ${selected ? styles.editing : ''} 
                ${deleting ? styles.deleting : ''}`}
        key={id}
      >
        <motion.div
                aria-checked={selected}
            className={styles.triggerBox}
                onClick={() => setSelected(!selected)}
            role="checkbox"
            transition={{
                    duration: 0.133,
                }}>
                <Icon type="check-circle" theme={selected ? 'twoTone' : ''} />
          </motion.div>

        <motion.div animate={selected ? 'open' : 'closed'} className={styles.editBox} variants={variants}>
                <motion.button
                aria-label="Download Photo"
                className={styles.btn}
                onClick={handleDownload}
                whileHover={{ scale: 1.1 }}
              >
                <Icon type="copy" theme="twoTone" twoToneColor="#52c41a" />
              </motion.button>
            <motion.button
                    aria-label="Delete Photo"
                  className={styles.btn}
                  onClick={handleDelete}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon type="delete" theme="twoTone" twoToneColor="#eb2f96" />
                </motion.button>
          </motion.div>

            <div
            onClick={() => setOpen(true)}
            className={`${selected ? styles.scaleDown : ''} ${styles.imageContainer}`}
          >
            <div
                aria-label={`PhotoId: ${id}`}
                className={styles.img}
                    style={{
                        backgroundImage: `url("${src}")`,
                    }}
              />
            {open && <Lightbox mainSrc={src} onCloseRequest={() => setOpen(false)} />}
          </div>

        {deleting && (
                <div className={styles.inProgress}>
                    <Icon type="loading" spin />
            </div>
            )}

            <div className={styles.hoverOverlay} />
      </div>
    );
}

export default PhotoGridItem;
