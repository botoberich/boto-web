import React from 'react';

// State
import { useDispatch } from 'react-redux';
import { updateAlbumMetadata } from '../../services/album.service';
import { setAlbumMetaData } from '../../redux/album/album.actions';

// UI
import { Tooltip, Button, Icon, notification, Typography } from 'antd';
import styles from './SetAlbumCover.module.css';

// Types
import { ArgsProps } from 'antd/lib/notification';
import { notifySuccess, notifyError } from '../../utils/notification';

const { Paragraph } = Typography;

function SetAlbumCover({ albumId, selectedThumbnails, setSelectedThumbnails }) {
    const dispatch = useDispatch();

    return (
        <Tooltip placement="bottom" title={selectedThumbnails.length !== 1 ? 'Please select at most one photo' : ''}>
            <Button
                onClick={e => {
                    try {
                        if (selectedThumbnails.length !== 1) {
                            return;
                        }

                        updateAlbumMetadata(albumId, { coverId: selectedThumbnails[0] }).then(res => {
                            if (res && res.status === 'success') {
                                // Updating the album metadata causes it to lose its photos in-memory
                                // TODO: Fix
                                // dispatch(setAlbumMetaData(albumId, res.data));
                            }
                        });
                        notifySuccess(`Successfully changed album cover.`);
                    } catch (err) {
                        notifyError(`Unable to change album cover. Please contact support`);
                    }

                    setSelectedThumbnails([]);
                }}>
                <Icon type="copy" theme="twoTone" twoToneColor="#52c41a" />
                <span className={styles.hideMobile}>Set Album Cover</span>
            </Button>
        </Tooltip>
    );
}

export default SetAlbumCover;
