import React from 'react';

// UI
import { Alert } from 'antd';
import PhotoGrid from '../components/PhotoGrid';
import UploadOverlay from '../components/uploadOverlay';
import 'react-image-lightbox/style.css';

// State
import { deletePhoto, getMiniPhotos } from '../services/photo.service';

// Types
type FetchedPhoto = {
    id: string;
    photoId: string;
    src: string;
};

function PhotoScreen() {
    const [fetchedPhotos, setFetchedPhotos] = React.useState<FetchedPhoto[]>([]);
    const [uploadError, setUploadError] = React.useState(null);

    React.useEffect(() => {
        async function run() {
            try {
                const { data } = await getMiniPhotos();
                const { photos, metaData } = data;
                if (photos !== undefined && photos.length > 0) {
                    const fetchedPhotos: FetchedPhoto[] = photos.map(photo => ({
                        src: `data:image/jpeg;base64,${photo.src}`,
                        photoId: photo.photoId,
                        id: photo.id,
                    }));
                    setFetchedPhotos(fetchedPhotos);
                }
            } catch (e) {
                setUploadError(e);
            }
        }

        run();
    }, []);

    return (
        <div>
            {uploadError && (
                <Alert style={{ marginTop: '16px', marginBottom: '16px' }} message={uploadError} type="error" />
            )}

            <div className="photoGrid">
                <PhotoGrid deletePhoto={deletePhoto} photos={fetchedPhotos}></PhotoGrid>
            </div>

            <UploadOverlay></UploadOverlay>
        </div>
    );
    // }
}

export default PhotoScreen;
