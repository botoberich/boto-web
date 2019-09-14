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
import { isMobileOnly } from 'react-device-detect';

const { Paragraph } = Typography;

function AddToOneAlbum({ albumId, selectedThumbnails, setSelectedThumbnails }) {
    return (
        <>
            <Button
                style={isMobileOnly ? { border: 'none', boxShadow: 'none', padding: 0 } : {}}
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
                <span>Add To Album</span>
            </Button>
        </>
    );
}

export default AddToOneAlbum;
