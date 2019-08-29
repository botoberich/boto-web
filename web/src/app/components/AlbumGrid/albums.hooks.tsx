import React from 'react';

// UI
import { Icon, Modal, Tooltip, Input } from 'antd';
import styles from './AlbumGrid.module.css';

// State
import { updateAlbumMetadata } from '../../services/album.service';

// Types
import { IAlbumMetadata } from '../../interfaces/albums.interface';

export function useEditAlbumModal(album: IAlbumMetadata, { onSuccess = () => {} }) {
    const [visible, setVisible] = React.useState(false);
    const [title, setTitle] = React.useState(album.title);
    const [desc, setDesc] = React.useState(album.description);
    const [validInput, setValidInput] = React.useState(true);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const handleEditAlbum = React.useCallback(async () => {
        if (title.length === 0) {
            setValidInput(false);
            return;
        }

        setConfirmLoading(true);

        let resp = await updateAlbumMetadata(album._id, {
            title: title,
            description: desc,
        });

        console.log('edit album response:', resp);
        if (resp !== undefined && resp.status === 'success') {
            onSuccess();
        }

        setConfirmLoading(false);
        setVisible(false);
    }, [title, desc]);

    return {
        Modal: (
            <EditModal
                album={album}
                handleEditAlbum={handleEditAlbum}
                visible={visible}
                setVisible={setVisible}
                confirmLoading={confirmLoading}
                validInput={validInput}
                setValidInput={setValidInput}
                title={title}
                setTitle={setTitle}
                desc={desc}
                setDesc={setDesc}></EditModal>
        ),
        visible,
        setVisible,
        confirmLoading,
        setConfirmLoading,
        validInput,
        setValidInput,
        title,
        setTitle,
        desc,
        setDesc,
    };
}

function EditModal({
    album,
    handleEditAlbum,
    visible,
    setVisible,
    confirmLoading,
    validInput,
    setValidInput,
    title,
    setTitle,
    desc,
    setDesc,
}) {
    return (
        <Modal
            title={`Editing album ${album.title}`}
            visible={visible}
            onOk={handleEditAlbum}
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
    );
}
