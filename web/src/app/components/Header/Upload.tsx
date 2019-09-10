import React from 'react';

// State
import { handleFileUpload } from '../Photo/photos.hooks';

// UI
import { Icon } from 'antd';
import styles from './Upload.module.css';

function Upload({ useServer, setThumbnails, progressDispatch }) {
    return (
        <label className={styles.uploadFileLabel}>
            <input
                className={styles.uploadFile}
                multiple
                accept="image/*"
                onChange={e => {
                    handleFileUpload(useServer, e, {
                        onStart: payload => progressDispatch({ type: 'START', payload }),
                        onNext: res => {
                            setThumbnails(thumbnails => {
                                let photoId = res.metaData._id;
                                let dateString = new Date(res.metaData.createdAt).toDateString();
                                let copy = { ...thumbnails };
                                copy[dateString] = copy[dateString] ? { ...copy[dateString], ...{ [photoId]: res } } : { [photoId]: res };
                                return copy;
                            });
                            progressDispatch({ type: 'NEXT' });
                        },
                        onComplete: () => {
                            progressDispatch({ type: 'END' });
                        },
                    });
                }}
                type="file"
            />
            <Icon type="cloud-upload" style={{ marginRight: '5px', color: '#1890ff' }} />
            <span className={styles.hideMobile}>Upload</span>
        </label>
    );
}

export default Upload;
