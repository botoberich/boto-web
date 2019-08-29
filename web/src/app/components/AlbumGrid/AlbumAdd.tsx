import React from 'react';

// UI
import { Icon, Typography, Modal, Tooltip, Input } from 'antd';
import styles from './AlbumGrid.module.css';

// State

const { Paragraph } = Typography;

function AlbumAdd() {
    return (
        <>
            <div
                aria-labelledby="create-album"
                className={`${styles.albumCover} ${styles.albumAdd}`}
                onClick={() => console.log('Route to new album page')}
                role="button">
                <Icon type="plus" />
            </div>
            <div className={styles.albumHeader}>
                <Paragraph id="create-album" className={styles.description}>
                    Create an album
                </Paragraph>
            </div>
        </>
    );
}

export default AlbumAdd;
