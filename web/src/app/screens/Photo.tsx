import React from 'react';

// UI
import { Alert, Upload, Button, Icon } from 'antd';
import PhotoGrid from '../components/PhotoGrid';
import UploadOverlay from '../components/UploadOverlay';
import 'react-image-lightbox/style.css';

// State
import { deletePhoto, getMiniPhotos } from '../services/photo.service';
import { useFileUpload } from '../hooks/photos.hooks';

// Types
type FetchedPhoto = {
    id: string;
    photoId: string;
    src: string;
};

function PhotoScreen() {
    const [downloadComplete, setDownloadComplete] = React.useState<boolean>(false);
    const [fetchedPhotos, setFetchedPhotos] = React.useState<FetchedPhoto[]>([]);
    const [uploadError, setUploadError] = React.useState(null);

    const handleFileUpload = e => {
        useFileUpload(e, () => setDownloadComplete(true));
    };

    React.useEffect(() => {
        async function run() {
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
        }

        run();
    }, [fetchedPhotos]);

    return (
        <div>
            {uploadError && (
                <Alert style={{ marginTop: '16px', marginBottom: '16px' }} message={uploadError} type="error" />
            )}

            <div>
                <Upload listType="picture" multiple onChange={handleFileUpload}>
                    <Button>
                        <Icon type="upload" /> Upload
                    </Button>
                </Upload>
            </div>

            <div className="photoGrid">
                <PhotoGrid
                    deletePhoto={deletePhoto}
                    downloadComplete={downloadComplete}
                    photos={fetchedPhotos}></PhotoGrid>
            </div>

            <UploadOverlay></UploadOverlay>
        </div>
    );
    // }
}

export default PhotoScreen;
