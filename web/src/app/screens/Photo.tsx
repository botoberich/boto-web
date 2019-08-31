import React from 'react';

// UI
import PhotoGrid, { usePhotoGrid } from '../components/Photo/PhotoGrid'

function PhotoScreen() {
    const { loading, thumbnails } = usePhotoGrid();
    return <PhotoGrid loading={loading} thumbnails={thumbnails} />;
}

export default PhotoScreen;
