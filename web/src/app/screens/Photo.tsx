import React from 'react';

// // State
import { useSelector } from 'react-redux';
import { skeletonSelector } from '../redux/photo/photo.selectors';

// UI
import PhotoGrid, { usePhotoGrid } from '../components/Photo/PhotoGrid';

function PhotoScreen() {
    const { loading } = usePhotoGrid();
    const skeleton = useSelector(state => skeletonSelector(state));
    return <PhotoGrid loading={loading} skeleton={skeleton} />;
}

export default PhotoScreen;
