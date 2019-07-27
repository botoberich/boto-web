import React, { useState } from 'react';
import { Icon } from 'antd';
import styles from './PhotoGridItem.module.css';

function PhotoGridItem({ src, b64, i }) {
    const [isEdit, setEdit] = useState(false);
    return (
        <div className={`${styles.editableContainer} ${isEdit ? styles.editing : ''}`} key={b64.slice(0, 10) + i}>
            <div role="checkbox" aria-checked={isEdit} className={styles.editCheckBox} onClick={() => setEdit(!isEdit)}>
                <Icon type="check-circle" theme={isEdit ? 'twoTone' : ''} />
            </div>
            <div className={styles.hoverOverlay}></div>
            <div className={`${isEdit ? styles.scaleDown : ''} ${styles.imageContainer}`}>
                {isEdit ? (
                    <a download={`DEFAULT_IMAGE_${i}.png`} href={isEdit ? src : ''}>
                        <img alt={'DEFAULT_IMAGE' + i} src={src}></img>
                    </a>
                ) : (
                    <img alt={'DEFAULT_IMAGE' + i} src={src}></img>
                )}
            </div>
        </div>
    );
}

export default PhotoGridItem;
