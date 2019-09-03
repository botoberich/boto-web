import React from 'react';

// State
import { handleAddToAlbum } from '../Album/albums.hooks';
import { getAlbums } from '../../services/album.service';

// UI
import { Tooltip, Button, Icon, notification, Typography, Modal } from 'antd';
import styles from './AddToAlbum.module.css';

// Types
import { ArgsProps } from 'antd/lib/notification';

const { Paragraph } = Typography;

// TODO: Again, refactor this to use a single notification config later
const notificationConfig = (msg: string): ArgsProps => ({
    placement: 'bottomRight',
    bottom: 50,
    duration: 3,
    message: (
        <div>
            <Paragraph>{msg}</Paragraph>
        </div>
    ),
});

function AddToAlbum({ selectedThumbnails, setSelectedThumbnails }) {
    const [visible, setVisible] = React.useState(false);
    const [albums, setAlbums] = React.useState([]);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    return (
        <>
            <Tooltip
                placement="bottom"
                title={selectedThumbnails.length === 0 ? 'Please select at least one photo.' : ''}>
                <div
                    // disabled={selectedThumbnails.length === 0}
                    onClick={async () => {
                        try {
                            if (selectedThumbnails.length <= 0) {
                                return;
                            }
                            
                            setVisible(true);
                            const resp = await getAlbums();
                            if (resp.status === 'success') {
                                setAlbums(Object.values(resp.data));
                            }
                        } catch (err) {
                            notification.error(notificationConfig(`Trouble adding photos.`));
                        }
                    }}>
                    <Icon type="wallet" theme="twoTone" />
                    <span className={styles.hideMobile}>Add To Album</span>
                </div>
            </Tooltip>

            <Modal
                bodyStyle={{ padding: '8px 0 8px 0' }}
                confirmLoading={confirmLoading}
                footer={null}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                title="Albums"
                visible={visible}>
                <ul className={styles.list}>
                    {albums.map(album => {
                        return (
                            <li
                                className={styles.listItem}
                                key={album._id}
                                onClick={async () => {
                                    console.log('Saving photos to album ', album._id);
                                    setConfirmLoading(true);
                                    try {
                                        const res = await handleAddToAlbum({
                                            albumId: album._id,
                                            photoIds: selectedThumbnails,
                                        });
                                        if (res.status === 'success') {
                                            notification.success(
                                                notificationConfig(
                                                    `Successfully added ${
                                                        selectedThumbnails.length > 1 ? 'photos' : 'photo'
                                                    } to album.`
                                                )
                                            );
                                        } else {
                                            notification.error(notificationConfig(`Trouble adding photos.`));
                                        }
                                        setConfirmLoading(false);
                                        setVisible(false);
                                        setSelectedThumbnails([]);
                                    } catch (e) {
                                        notification.error(notificationConfig(`Trouble adding photos.`));
                                        setConfirmLoading(false);
                                        setVisible(false);
                                    }
                                }}>
                                <span className={styles.icon}>
                                    <Icon type="fire" theme="twoTone" />{' '}
                                </span>
                                {album.title}
                            </li>
                        );
                    })}
                </ul>
            </Modal>
        </>
    );
}

export default AddToAlbum;
