import React from 'react';

// UI
import PhotoGrid from '../components/PhotoGrid';
import UploadOverlay from '../components/uploadOverlay';
import 'react-image-lightbox/style.css';

function PhotoScreen() {
    return (
        <div>
            {/* {uploadError && (
                <Alert style={{ marginTop: '16px', marginBottom: '16px' }} message={uploadError} type="error" />
            )} */}

            <div className="photoGrid">
                <PhotoGrid />
            </div>

            <UploadOverlay />
        </div>
    );
}

export default PhotoScreen;
