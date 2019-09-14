import React from 'react';

import { handleDeletePhotos } from '../Photo/photos.hooks';

// UI
import { Tooltip, Button, Icon } from 'antd';
import styles from './Delete.module.css';

// Types
import { IPhotoMetadata } from '../../interfaces/photos.interface';
import { isMobileOnly } from 'react-device-detect';

function Delete({ useServer, selectedThumbnails, setSelectedThumbnails, progressDispatch, setLoadingThumbnails, removePhoto }) {
    return (
        <Button
            style={isMobileOnly ? { border: 'none', boxShadow: 'none', padding: 0 } : {}}
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
            <span>Delete</span>
        </Button>
    );
}

export default Delete;
