import React from 'react';

import { handleDeletePhotos } from '../Photo/photos.hooks';

// UI
import { Tooltip, Button, Icon } from 'antd';
import styles from './Delete.module.css';

// Types
import { IPhotoMetadata } from '../../interfaces/photos.interface';

function Delete({ useServer, selectedThumbnails, setSelectedThumbnails, progressDispatch, setLoadingThumbnails, removePhoto }) {
    return (
        <Tooltip placement="bottom" title={selectedThumbnails.length === 0 ? 'Please select at least one photo.' : ''}>
            <Button
                // disabled={selectedThumbnails.length === 0}
                onClick={() => {
                    if (selectedThumbnails.length <= 0) {
                        return;
                    }
                    handleDeletePhotos(useServer, [...selectedThumbnails], {
                        onStart: payload => {
                            setLoadingThumbnails(selectedThumbnails);
                            progressDispatch({ type: 'START', payload });
                        },
                        onNext: (metaData: IPhotoMetadata) => {
                            removePhoto(metaData);
                            progressDispatch({ type: 'NEXT' });
                        },
                        onComplete: () => {
                            progressDispatch({ type: 'END' });
                            setLoadingThumbnails([]);
                            setSelectedThumbnails([]);
                        },
                        onError: () => {
                            setLoadingThumbnails([]);
                            setSelectedThumbnails([]);
                        },
                    });
                }}>
                <Icon type="delete" theme="twoTone" twoToneColor="#eb2f96" />
                <span className={styles.hideMobile}>Delete</span>
            </Button>
        </Tooltip>
    );
}

export default Delete;
