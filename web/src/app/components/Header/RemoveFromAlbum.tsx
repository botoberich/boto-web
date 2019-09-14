import React from 'react';

// State
import { updateAlbumMetadata } from '../../services/album.service';
import { handleRemoveFromAlbum } from '../Album/albums.hooks';
import { removeAlbumPhotos, setAlbumMetaData } from '../../redux/album/album.actions';
import { albumPhotosSelector } from '../../redux/album/album.selectors';
import { useDispatch, useSelector } from 'react-redux';

// UI
import { Tooltip, Button, Icon, notification, Typography } from 'antd';
import styles from './RemoveFromAlbum.module.css';

// Types
import { ArgsProps } from 'antd/lib/notification';
import { notifySuccess, notifyError } from '../../utils/notification';
import { isMobileOnly } from 'react-device-detect';

const { Paragraph } = Typography;

function RemoveFromAlbum({ albumId, selectedThumbnails, setSelectedThumbnails, setLoadingThumbnails }) {
    const dispatch = useDispatch();
    const currentPhotos = useSelector(state => albumPhotosSelector(state, albumId));

    return (
        <Button
            style={isMobileOnly ? { border: 'none', boxShadow: 'none', padding: 0 } : {}}
            onClick={async () => {
                try {
                    setLoadingThumbnails(selectedThumbnails);

                    const resp = await handleRemoveFromAlbum({ albumId, photoIds: selectedThumbnails });

                    if (resp.status === 'success') {
                        dispatch(removeAlbumPhotos(albumId, selectedThumbnails));
                        // Have to subtract because currentPhotos does not update in time after the recent photo removal
                        if (currentPhotos.length - selectedThumbnails.length <= 0) {
                            // Use promise to not delay the notification
                            updateAlbumMetadata(albumId, { coverId: '' }).then(res => {
                                if (res && res.status === 'success') {
                                    dispatch(setAlbumMetaData(albumId, res.data));
                                }
                            });
                        }

                        setLoadingThumbnails([]);
                        notifySuccess(`Removed ${selectedThumbnails.length} ${selectedThumbnails.length > 1 ? 'photos' : 'photo'} from album.`);
                    } else {
                        notifyError(`Unable to remove photos from album. Please contact support.`);
                    }
                } catch (err) {
                    notifyError(`Unable to remove photos from album. Please contact support.`);
                }

                setSelectedThumbnails([]);
            }}>
            <Icon type="minus-circle" theme="twoTone" twoToneColor="#ff5500" />
            <span>Remove From Album</span>
        </Button>
    );
}

export default RemoveFromAlbum;
