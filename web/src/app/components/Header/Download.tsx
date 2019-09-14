import React from 'react';

// State
import { handleDownloadPhotos } from '../Photo/photos.hooks';

// UI
import { Tooltip, Button, Icon, notification, Typography } from 'antd';
import styles from './Download.module.css';

// Types
import { ArgsProps } from 'antd/lib/notification';
import { notifySuccess, notifyError } from '../../utils/notification';
import { isMobileOnly } from 'react-device-detect';

const { Paragraph } = Typography;

function Download({ className = '', useServer, selectedThumbnails, setSelectedThumbnails }) {
    return (
        <Button
            style={isMobileOnly ? { border: 'none', boxShadow: 'none', padding: 0 } : {}}
            onClick={e => {
                try {
                    if (selectedThumbnails.length <= 0) {
                        return;
                    }

                    handleDownloadPhotos(useServer, selectedThumbnails);
                    notifySuccess(`Downloaded ${selectedThumbnails.length} ${selectedThumbnails.length > 1 ? 'files' : 'file'}.`);
                } catch (err) {
                    notifyError(`Error downloading files. Please contact support.`);
                }

                setSelectedThumbnails([]);
            }}>
            <Icon type="copy" theme="twoTone" twoToneColor="#52c41a" />
            <span>Download</span>
        </Button>
    );
}

export default Download;
