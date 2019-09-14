import React from 'react';

// State
import { handleAddToAlbum } from '../Album/albums.hooks';
import { getAlbums } from '../../services/album.service';

// UI
import { Tooltip, Button, Icon, notification, Typography, Modal, Empty } from 'antd';
import styles from './AddToAlbum.module.css';

// Types
import { ArgsProps } from 'antd/lib/notification';
import { navigate } from 'gatsby';
import { notifyError, notifySuccess } from '../../utils/notification';
import { isMobileOnly } from 'react-device-detect';

const { Paragraph } = Typography;

function AddToAlbum({ className = '', selectedThumbnails, setSelectedThumbnails }) {
    const [visible, setVisible] = React.useState(false);
    const [albums, setAlbums] = React.useState([]);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    return (
        <>
            <Button
                style={isMobileOnly ? { border: 'none', boxShadow: 'none', padding: 0 } : {}}
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
                        notifyError(`Unable to add photos to album. Please contact support.`);
                    }
                }}>
                <Icon type="wallet" theme="twoTone" />
                <span className={styles.hideMobiles}>Add To Album</span>
            </Button>

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
                                    setConfirmLoading(true);
                                    try {
                                        const res = await handleAddToAlbum({
                                            albumId: album._id,
                                            photoIds: selectedThumbnails,
                                        });

                                        if (res.status === 'success') {
                                            notifySuccess(
                                                `Added ${selectedThumbnails.length} ${selectedThumbnails.length > 1 ? 'photos' : 'photo'} to album ${
                                                    res.data.albumMetadata.title
                                                }.`
                                            );
                                        } else {
                                            notifyError(`Unable to add photos to album. Please contact support.`);
                                        }
                                        setConfirmLoading(false);
                                        setVisible(false);
                                        setSelectedThumbnails([]);
                                    } catch (e) {
                                        notifyError(`Unable to add photos to album. Please contact support.`);
                                        setConfirmLoading(false);
                                        setVisible(false);
                                    }
                                }}>
                                <span className={styles.icon}>
                                    <Icon type="wallet" theme="twoTone" />{' '}
                                </span>
                                {album.title}
                            </li>
                        );
                    })}
                </ul>

                {albums.length === 0 && (
                    <Empty style={{ marginBottom: '10px' }} description={<span>No albums 😢</span>}>
                        <Button onClick={() => navigate('/app/albums/new')} type="primary">
                            <Icon type="wallet" theme="twoTone" /> Create One
                        </Button>
                    </Empty>
                )}
            </Modal>
        </>
    );
}

export default AddToAlbum;
