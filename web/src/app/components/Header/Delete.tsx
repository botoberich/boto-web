import React from 'react';

import { handleDeletePhotos } from '../Photo/photos.hooks'

// UI
import { Tooltip, Button, Icon } from 'antd';
import styles from './Delete.module.css';

function Delete({ selectedThumbnails, setSelectedThumbnails, progressDispatch, setloadingThumbnails, setThumbnails }) {
    return (
        <Tooltip placement="bottom" title={selectedThumbnails.length === 0 ? 'Please select at least one photo.' : ''}>
            <Button
                disabled={selectedThumbnails.length === 0}
                onClick={() => {
                    handleDeletePhotos([...selectedThumbnails], {
                        onStart: payload => {
                            setloadingThumbnails(selectedThumbnails);
                            progressDispatch({ type: 'START', payload });
                        },
                        onNext: metaData => {
                            setThumbnails(thumbnails => {
                                let dateString = new Date(metaData.createdAt).toDateString();
                                let copy = { ...thumbnails };
                                delete copy[dateString][metaData._id];
                                if (Object.keys(copy[dateString]).length === 0) {
                                    delete copy[dateString];
                                }
                                return copy;
                            });
                            progressDispatch({ type: 'NEXT' });
                        },
                        onComplete: () => {
                            progressDispatch({ type: 'END' });
                            setloadingThumbnails([]);
                            setSelectedThumbnails([]);
                        },
                        onError: () => {
                            setloadingThumbnails([]);
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
