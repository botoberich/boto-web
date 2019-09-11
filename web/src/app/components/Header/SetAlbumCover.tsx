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
                        notification.success(notificationConfig(`Changed album cover.`));
                    } catch (err) {
                        notification.error(notificationConfig(`Error changing album cover.`));
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
