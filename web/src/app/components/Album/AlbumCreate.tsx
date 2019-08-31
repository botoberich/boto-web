import React from 'react';
import { navigate } from 'gatsby';

// UI
import AlbumForm, { useAlbumForm } from './AlbumForm';
import PhotoGrid, { usePhotoGrid } from '../Photo/PhotoGrid';
import { Typography, Button, notification } from 'antd';
import styles from './AlbumCreate.module.css';

// State
import { usePhotoContext } from '../../contexts/PhotoContext';
import { createAlbum } from '../../services/album.service';

// Types
import { ArgsProps } from 'antd/lib/notification'
import { IAlbumMetadata } from '../../interfaces/albums.interface';

const { Title, Paragraph } = Typography;

function AlbumCreate() {
    const { title, setTitle, desc, setDesc, validInput, setValidInput } = useAlbumForm({
        initialDesc: '',
        initialTitle: '',
    });

    const notificationConfig = (msg: string): ArgsProps => ({
        // TODO: Refactor to use a global navigation singleton
        placement: 'bottomRight',
        bottom: 50,
        duration: 3,
        message: (
            <div>
                <Paragraph>{msg}</Paragraph>
            </div>
        ),
    });

    const { thumbnails, loading } = usePhotoGrid();

    const { selectedThumbnails } = usePhotoContext();

    const handleNewAlbumCreation = React.useCallback(async () => {
        setValidInput(true);

        if (title.length === 0) {
            setValidInput(false);
            return;
        }

        const albumMetaData: IAlbumMetadata = {
            title,
            description: desc,
            coverId: selectedThumbnails[0],
        };


        notification.success(notificationConfig("Creating your album"))

        const resp = await createAlbum(selectedThumbnails, albumMetaData);

        if (resp.status === 'success') {
            const albumId = resp.data.albumMetadata._id;
            navigate(`/app/albums/${albumId}`);
        }
    }, [selectedThumbnails, title, desc]);

    return (
        <>
            <div className={styles.inputContainer}>
                <Title level={1}>Create a new album</Title>
                <div className={styles.row}>
                    <div>
                        <AlbumForm
                            setTitle={setTitle}
                            title={title}
                            setDesc={setDesc}
                            desc={desc}
                            setValidInput={setValidInput}
                            validInput={validInput}></AlbumForm>
                    </div>
                </div>
                <div className={`${styles.row} ${styles.btnRow}`}>
                    <Button disabled={title.length === 0} onClick={handleNewAlbumCreation} size="large" type="primary">
                        Create
                    </Button>
                </div>
            </div>
            <div className={styles.row}>
                <PhotoGrid thumbnails={thumbnails} loading={loading}></PhotoGrid>
            </div>
        </>
    );
}

export default AlbumCreate;
