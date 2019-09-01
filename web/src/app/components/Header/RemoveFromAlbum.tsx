import React from 'react';

// State
import { handleRemoveFromAlbum } from '../Album/albums.hooks';

// UI
import { Tooltip, Button, Icon, notification, Typography } from 'antd';
import styles from './Header.module.css';

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

function RemoveFromAlbum({ albumId, selectedThumbnails, setSelectedThumbnails, setThumbnails, thumbnails }) {
    return (
        <Tooltip placement="bottom" title={selectedThumbnails.length === 0 ? 'Please select at least one photo.' : ''}>
            <Button
                disabled={selectedThumbnails.length === 0}
                onClick={async () => {
                    try {
                        notification.success(
                            notificationConfig(`Removing ${selectedThumbnails.length > 1 ? 'photos' : 'photo'}.`)
                        );

                        const resp = await handleRemoveFromAlbum({ albumId, photoIds: selectedThumbnails });

                        if (resp.status === 'success') {
                            notification.success(
                                notificationConfig(
                                    `Successfully removed ${selectedThumbnails.length > 1 ? 'photos' : 'photo'}.`
                                )
                            );

                            let filteredThumbnails = { ...thumbnails };
                            Object.entries(thumbnails).map(([date]) => {
                                selectedThumbnails.map(removed => {
                                    // Remove from DOM the removed photos
                                    delete filteredThumbnails[date][removed];

                                    // Remove the data as well
                                    if (Object.values(filteredThumbnails[date]).length === 0) {
                                        delete filteredThumbnails[date];
                                    }
                                });
                            });
                            setThumbnails(filteredThumbnails);
                        } else {
                            notification.error(notificationConfig(`Trouble removing photos.`));
                        }
                    } catch (err) {
                        notification.error(notificationConfig(`Trouble removing photos.`));
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
