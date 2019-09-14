import React from 'react';

// State
import { handleAddToAlbum } from '../Album/albums.hooks';
import { getAlbums, addToAlbum } from '../../services/album.service';

// UI
import { Tooltip, Button, Icon, notification, Typography, Modal, Empty } from 'antd';
import styles from './AddToAlbum.module.css';

// Types
import { ArgsProps } from 'antd/lib/notification';
import { navigate } from 'gatsby';
import { notifyError, notifySuccess } from '../../utils/notification';

const { Paragraph } = Typography;

function AddToOneAlbum({ albumId, selectedThumbnails, setSelectedThumbnails }) {
    return (
        <>
            <Tooltip
                placement="bottom"
                title={
                    selectedThumbnails.length === 0
                        ? 'Please select at least one photo.'
                        : `Add ${selectedThumbnails.length} ${selectedThumbnails.length > 1 ? 'photos' : 'photo'} to the album.`
                }>
                <Button
                    onClick={async () => {
                        try {
                            const res = await handleAddToAlbum({
                                albumId,
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
                            setSelectedThumbnails([]);
                        } catch (e) {
                            setSelectedThumbnails([]);
                            notifyError(`Unable to add photos to album. Please contact support.`);
                        }
                    }}>
                    <Icon type="wallet" theme="twoTone" />
                    <span className={styles.hideMobile}>Add To Album</span>
                </Button>
            </Tooltip>
        </>
    );
}

export default AddToOneAlbum;
