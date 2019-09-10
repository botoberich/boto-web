import React from 'react';

// State
import { handleFileUpload } from '../Photo/photos.hooks';

// UI
import { Icon } from 'antd';
import styles from './Upload.module.css';

function Upload({ useServer, addPhoto, progressDispatch }) {
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
                            addPhoto(res);
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
