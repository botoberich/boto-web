import React from 'react';

// UI
import { Alert, Upload, Button, Icon } from 'antd';
import PhotoGrid from '../components/PhotoGrid';
import UploadOverlay from '../components/UploadOverlay';
import 'react-image-lightbox/style.css';

// State
import { getExif } from '../utils/exif';
import { getOwnPhotos, postPhotos, deletePhoto, getThumbnails } from '../services/photo.service';
import { getBase64 } from '../utils/encoding';
import PhotoWorker from '../services/photo.worker';

// Types
import { PhotoResponse } from '../utils/apiResponse';
// import { Photo } from '../services/photo.service';

type State = {
    downloadComplete: boolean;
    fetchedPhotos: {
        src: string;
        id: string;
    }[];
    uploadError: any;
    input: any;
};

type Props = {};

const worker = typeof window === 'object' && PhotoWorker();

class ApiTestScreen extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleFileDelete = this.handleFileDelete.bind(this);

        this.state = {
            downloadComplete: false,
            fetchedPhotos: [],
            uploadError: null,
            deleteId: '',
        };
    }

    async componentDidMount() {
        const getRes = await getThumbnails();
        if (getRes.status === 'success') {
            let $thumbnails = getRes.data.$thumbnails;
            $thumbnails.subscribe({
                next: res => {
                    console.log(`Thumbnail downloaded for photo: ${res.photoId}`);
                },
                error: err => {
                    console.log(`Error downloading thumbnail: ${err}`);
                },
                complete: () => {
                    console.log(`Thumbnails download completed.`);
                },
            });
        } else {
            console.log(`Error downloading thumbnail: ${getRes.data}`);
        }
    }

    async handleFileUpload(e) {
        if (e.file.status === 'done') {
            const file: File = e.file.originFile || e.file.originFileObj;
            const metaData = { title: file.name, archived: false, trashed: false };

            let postRes = await postPhotos([{ metaData, file }]);
            if (postRes.status === 'success') {
                let $postPhotos = postRes.data.$photos;
                let photoIds = postRes.data.photoIds;

                $postPhotos.subscribe({
                    next: res => {
                        console.log('Uploaded photo id: ', res.photoId);
                    },
                    error: err => {
                        console.log('Upload error: ', err);
                    },
                    complete: () => {
                        console.log('Uploads completed.');
                    },
                });
            } else {
                console.log('Error: ', postRes.data);
            }
        }
    }

    async handleFileDelete(e) {
        console.log('DELETING PHOTO ID:', this.state.deleteId);
    }

    render() {
        const { downloadComplete, fetchedPhotos, uploadError } = this.state;

        return (
            <div>
                {uploadError && <Alert style={{ marginTop: '16px', marginBottom: '16px' }} message={uploadError} type="error" />}

                <div>
                    <Upload listType="picture" multiple onChange={this.handleFileUpload}>
                        <Button>
                            <Icon type="upload" /> Upload
                        </Button>
                    </Upload>
                </div>

                <input
                    onChange={e => {
                        this.setState({ deleteId: e.target.value });
                    }}
                    type="text"
                    name=""
                    id=""
                />
                <Button onClick={this.handleFileDelete}>Delete</Button>

                <div className="photoGrid">
                    <PhotoGrid deletePhoto={deletePhoto} downloadComplete={downloadComplete} photos={fetchedPhotos}></PhotoGrid>
                </div>
            </div>
        );
    }
}

export default ApiTestScreen;
