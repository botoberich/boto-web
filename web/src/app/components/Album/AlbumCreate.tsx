import React from 'react';

// UI
import AlbumForm, { useAlbumForm } from './AlbumForm';
import PhotoGrid, { usePhotoGrid } from '../Photo/PhotoGrid';
import { Typography, Button } from 'antd';
import styles from './AlbumCreate.module.css';

// State
import { usePhotoContext } from '../../contexts/PhotoContext';
import { createAlbum } from '../../services/album.service';

// Types
import { IAlbumMetadata } from '../../interfaces/albums.interface';

const { Title } = Typography;

function AlbumCreate() {
    // 1. Handle inputs for new album
    // 2. Allow selection of photos to add to album
    // 3. Navigate user to new album on success
    // 4. If canceled, navigate back to many-album view
    // 5. Show a cancel and save button

    const { title, setTitle, desc, setDesc, validInput, setValidInput } = useAlbumForm({
        initialDesc: '',
        initialTitle: '',
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

        console.log({ albumMetaData });

        console.log('Creating new album');
        const resp = await createAlbum(selectedThumbnails, albumMetaData);
        console.log({ resp });
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
