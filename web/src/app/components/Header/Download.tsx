import React from 'react';

// State
import { handleDownloadPhotos } from '../Photo/photos.hooks';

// UI
import { Tooltip, Button, Icon, notification, Typography } from 'antd';
import styles from './Download.module.css';

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

function Download({ selectedThumbnails, setSelectedThumbnails }) {
    return (
        <Tooltip placement="bottom" title={selectedThumbnails.length === 0 ? 'Please select at least one photo.' : ''}>
            <div
                // disabled={selectedThumbnails.length === 0}
                onClick={e => {
                    try {
                        if (selectedThumbnails.length <= 0) {
                            return;
                        }
                        
                        handleDownloadPhotos(selectedThumbnails);
                        notification.success(
                            notificationConfig(
                                `Successfully downloaded ${selectedThumbnails.length > 1 ? 'files' : 'file'}.`
                            )
                        );
                    } catch (err) {
                        notification.error(notificationConfig(`Error downloading files. Please contact support.`));
                    }

                    setSelectedThumbnails([]);
                }}>
                <Icon type="copy" theme="twoTone" twoToneColor="#52c41a" />
                <span className={styles.hideMobile}>Download</span>
            </div>
        </Tooltip>
    );
}

export default Download;
