import React from 'react';

// UI
import AlbumForm, { useAlbumForm } from './AlbumForm';
import PhotoGrid, { usePhotoGrid } from '../Photo/PhotoGrid';
import { Typography } from 'antd';

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

    return (
        <>
            <Title level={1}>Create a new album</Title>
            <AlbumForm
                setTitle={setTitle}
                title={title}
                setDesc={setDesc}
                desc={desc}
                setValidInput={setValidInput}
                validInput={validInput}></AlbumForm>
            <PhotoGrid thumbnails={thumbnails} loading={loading}></PhotoGrid>
        </>
    );
}

export default AlbumCreate;
