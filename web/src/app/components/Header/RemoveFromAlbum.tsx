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

const { Paragraph } = Typography;

function RemoveFromAlbum({ albumId, selectedThumbnails, setSelectedThumbnails, setLoadingThumbnails }) {
    const dispatch = useDispatch();
    const currentPhotos = useSelector(state => albumPhotosSelector(state, albumId));

    return (
        <Tooltip placement="bottom" title={selectedThumbnails.length === 0 ? 'Please select at least one photo.' : ''}>
            <Button
                disabled={selectedThumbnails.length === 0}
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
                            notifySuccess(`Removed ${selectedThumbnails} ${selectedThumbnails.length > 1 ? 'photos' : 'photo'} from album.`);
                        } else {
                            notifyError(`Unable to remove photos from album. Please contact support.`);
                        }
                    } catch (err) {
                        notifyError(`Unable to remove photos from album. Please contact support.`);
                    }

                    setSelectedThumbnails([]);
                }}>
                <Icon type="copy" theme="twoTone" twoToneColor="#52c41a" />
                <span className={styles.hideMobile}>Remove From Album</span>
            </Button>
        </Tooltip>
    );
}

export default RemoveFromAlbum;
