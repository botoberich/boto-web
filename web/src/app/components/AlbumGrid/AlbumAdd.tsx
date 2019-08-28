import React from 'react';

// UI
import { Icon, Typography } from 'antd';
import styles from './AlbumGrid.module.css';

const { Paragraph } = Typography;

function AlbumAdd() {
    return (
        <>
            <div role="button" aria-label="Create album" className={`${styles.albumCover} ${styles.albumAdd}`}>
                <Icon type="plus" />
            </div>
            <div className={styles.albumHeader}>
                <Paragraph className={styles.description}>Create an album</Paragraph>
            </div>
        </>
    );
}

export default AlbumAdd;
