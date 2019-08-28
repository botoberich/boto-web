import React from 'react';

// UI
import { Icon, Typography, Modal, Tooltip, Input } from 'antd';
import styles from './AlbumGrid.module.css';

// State
import { createAlbum, removeFromAlbum, getAlbums, getAlbumById, deleteAlbum } from '../../services/album.service';

const { Paragraph } = Typography;

function AlbumAdd() {
    const [visible, setVisible] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const handleCreateAlbum = React.useCallback(() => {
        setVisible(true);
    }, []);

    return (
        <>
            <div
                aria-label="Create album"
                className={`${styles.albumCover} ${styles.albumAdd}`}
                onClick={() => handleCreateAlbum()}
                role="button">
                <Icon type="plus" />
            </div>
            <div className={styles.albumHeader}>
                <Paragraph className={styles.description}>Create an album</Paragraph>
            </div>

            <Modal
                title="Create a new album"
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}>
                <div className={styles.createInput}>
                    <Input
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Enter your album title"
                        prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix={
                            <Tooltip title="This will be editable soon.">
                                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                        value={title}
                    />
                </div>
                <div className={styles.createInput}>
                    <Input
                        onChange={e => setDesc(e.target.value)}
                        placeholder="Enter your album description"
                        prefix={<Icon type="tags" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix={
                            <Tooltip title="This will be editable soon.">
                                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                        value={desc}
                    />
                </div>
            </Modal>
        </>
    );
}

export default AlbumAdd;
