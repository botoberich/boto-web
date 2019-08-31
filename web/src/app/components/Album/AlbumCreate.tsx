import React from 'react';

// UI
import AlbumForm, { useAlbumForm } from './AlbumForm';
import PhotoGrid, { usePhotoGrid } from '../Photo/PhotoGrid';
import { Typography } from 'antd';
import styles from './AlbumCreate.module.css';

// State
import { usePhotoContext } from '../../contexts/PhotoContext';

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

    console.log({ selectedThumbnails });

    return (
        <>
            <Title level={1}>Create a new album</Title>
            <div className={styles.row}>
                <div className={styles.formContainer}>
                    <AlbumForm
                        setTitle={setTitle}
                        title={title}
                        setDesc={setDesc}
                        desc={desc}
                        setValidInput={setValidInput}
                        validInput={validInput}></AlbumForm>
                </div>
            </div>
            <div className={styles.row}>
                <PhotoGrid thumbnails={thumbnails} loading={loading}></PhotoGrid>
            </div>
        </>
    );
}

export default AlbumCreate;
