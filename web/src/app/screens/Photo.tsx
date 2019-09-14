import React from 'react';

// // State
import { useSelector } from 'react-redux';
import { skeletonSelector } from '../redux/photo/photo.selectors';

// UI
import PhotoGrid, { usePhotoGrid } from '../components/Photo/PhotoGrid';
import { useHeaderContext } from '../contexts/HeaderContext';

function PhotoScreen() {
    const { loading } = usePhotoGrid();
    const skeleton = useSelector(state => skeletonSelector(state));
    const { setTitle } = useHeaderContext();
    setTitle(`Photos`);
    return <PhotoGrid loading={loading} skeleton={skeleton} parent="photo" />;
}

export default PhotoScreen;
