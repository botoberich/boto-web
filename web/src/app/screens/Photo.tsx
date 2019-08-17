import React from 'react';

// UI
import PhotoGrid from '../components/PhotoGrid';
import UploadOverlay from '../components/uploadOverlay';
import 'react-image-lightbox/style.css';

function PhotoScreen() {
    return (
        <>
            <PhotoGrid />
            <UploadOverlay />
        </>
    );
}

export default PhotoScreen;
