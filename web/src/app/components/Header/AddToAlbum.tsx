import React from 'react';

// State
import { handleAddToAlbum } from '../Album/albums.hooks';

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

function AddToAlbum({ selectedThumbnails }) {
    return (
        <Tooltip placement="bottom" title={selectedThumbnails.length === 0 ? 'Please select at least one photo.' : ''}>
            <Button
                disabled={selectedThumbnails.length === 0}
                onClick={async () => {
                    try {
                        notification.success(
                            notificationConfig(`Adding ${selectedThumbnails.length > 1 ? 'photos' : 'photo'}.`)
                        );

                        // TODO: Create a modal of all the available albums

                        const resp = await handleAddToAlbum({ photoIds: selectedThumbnails });
                        // const resp = await new Promise(resolve => {
                        //     setTimeout(() => {
                        //         resolve({ status: 'success', data: {} });
                        //     }, 2000);
                        // });

                        console.log({ resp });
                        // const resp = await handleRemoveFromAlbum({ albumId, photoIds: selectedThumbnails });

                        // if (resp.status === 'success') {
                        //     notification.success(
                        //         notificationConfig(
                        //             `Successfully removed ${selectedThumbnails.length > 1 ? 'photos' : 'photo'}.`
                        //         )
                        //     );
                        // } else {
                        //     notification.error(notificationConfig(`Trouble removing photos.`));
                        // }
                    } catch (err) {
                        notification.error(notificationConfig(`Trouble removing photos.`));
                    }
                }}>
                <Icon type="wallet" theme="twoTone" />
                <span className={styles.hideMobile}>Add To Album</span>
            </Button>
        </Tooltip>
    );
}

export default AddToAlbum;
