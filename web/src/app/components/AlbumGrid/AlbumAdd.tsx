import React from 'react';

// UI
import { Icon, Typography, Modal, Tooltip, Input } from 'antd';
import styles from './AlbumGrid.module.css';

// State
import { createAlbum } from '../../services/album.service';

const { Paragraph } = Typography;

function AlbumAdd() {
    const [visible, setVisible] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [validInput, setValidInput] = React.useState(true);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const handleModalOpen = React.useCallback(() => {
        setVisible(true);
    }, []);

    const handleCreateAlbum = React.useCallback(async () => {
        if (title.length === 0) {
            setValidInput(false);
            return;
        }

        setConfirmLoading(true);

        let resp = await createAlbum([], {
            title: title,
            description: desc,
            coverId: '',
        });

        setConfirmLoading(false);
        setVisible(false);
    }, [title, desc]);

    return (
        <>
            <div
                aria-label="Create album"
                className={`${styles.albumCover} ${styles.albumAdd}`}
                onClick={() => handleModalOpen()}
                role="button">
                <Icon type="plus" />
            </div>
            <div className={styles.albumHeader}>
                <Paragraph className={styles.description}>Create an album</Paragraph>
            </div>

            <Modal
                title="Create a new album"
                visible={visible}
                onOk={handleCreateAlbum}
                onCancel={() => setVisible(false)}
                confirmLoading={confirmLoading}>
                <div className={styles.inputRow}>
                    <Tooltip placement="topLeft" title="Please enter a title" visible={!validInput}>
                        <Input
                            onChange={e => {
                                setValidInput(true);
                                setTitle(e.target.value);
                            }}
                            placeholder="Enter your album title"
                            prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            required
                            suffix={
                                <Tooltip title="This will be editable soon.">
                                    <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                            value={title}
                        />
                    </Tooltip>
                </div>
                <div className={styles.inputRow}>
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
