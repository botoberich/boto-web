import React, { useState } from 'react';

// UI
import Lightbox from 'react-image-lightbox';
import { Icon } from 'antd';
import styles from './PhotoGridItem.module.css';

function PhotoGridItem({ src, id }) {
    const [isOpen, setOpen] = useState(false);
    const [isEdit, setEdit] = useState(false);
    return (
        <div className={`${styles.editableContainer} ${isEdit ? styles.editing : ''}`} key={id}>
            <div role="checkbox" aria-checked={isEdit} className={styles.editCheckBox} onClick={() => setEdit(!isEdit)}>
                <Icon type="check-circle" theme={isEdit ? 'twoTone' : ''} />
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

export default PhotoGridItem;
