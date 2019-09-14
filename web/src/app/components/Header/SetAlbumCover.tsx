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
import { isMobileOnly } from 'react-device-detect';

const { Paragraph } = Typography;

function SetAlbumCover({ albumId, className = '', selectedThumbnails, setSelectedThumbnails }) {
    const dispatch = useDispatch();

    return (
        <Button
            style={isMobileOnly ? { border: 'none', boxShadow: 'none', padding: 0 } : {}}
            onClick={e => {
                try {
                    if (selectedThumbnails.length !== 1) {
                        return;
                    }

                    updateAlbumMetadata(albumId, { coverId: selectedThumbnails[0] }).then(res => {
                        if (res && res.status === 'success') {
                            // TODO: FIX. Updating the album metadata causes it to lose its photos in-memory
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
            <span>Set Album Cover</span>
        </Button>
    );
}

export default SetAlbumCover;
