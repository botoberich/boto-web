import React from 'react';

// UI
import { Alert, Upload, Button, Icon } from 'antd';
import PhotoGrid from '../components/PhotoGrid';
import UploadOverlay from '../components/UploadOverlay';
import 'react-image-lightbox/style.css';

// State
import { getExif } from '../utils/exif';
import { getOwnPhotos, postPhotos, deletePhoto, postMiniPhoto, getMiniPhotos } from '../services/photo.service';
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
    input: string;
    uploadError: any;
};

type Props = {};

const worker = typeof window === 'object' && PhotoWorker();

class PhotoScreen extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleTest = this.handleTest.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            downloadComplete: false,
            fetchedPhotos: [],
            input: '',
            uploadError: null,
        };
    }

    async componentDidMount() {
        const photoResponse = await getMiniPhotos();
        console.log('Mini photos response:', photoResponse);
    }

    // async componentDidMount() {
    //     const photoResponse = await getOwnPhotos();

    //     console.log({ photoResponse });

    //     if (!photoResponse) return;
    //     /**
    //      * The photo ids in each metadata object from the response should be used to initialize all loading photos by id
    //      * So, when the $photo observable streams {photoId, b64}, you know where to load the b64
    //      */

    //     if (photoResponse.status === 'success') {
    //         const { metaData } = photoResponse.data;

    //         if (worker) {
    //             const pendingPhotos = await worker.fillPendingPhotos(metaData.length, metaData);
    //             this.setState({ fetchedPhotos: pendingPhotos });
    //         }

    //         const $photos = photoResponse.data.$photos;

    //         $photos.subscribe({
    //             next: photo => {
    //                 console.log('Photo downloaded:', photo);
    //                 // Replace the corresponding photo placeholder with the newly fetched photos
    //                 const fetchedPhotos = {
    //                     ...this.state.fetchedPhotos,
    //                     [photo.photoId]: {
    //                         id: photo.photoId,
    //                         src: `data:image/jpeg;base64,${photo.b64}`,
    //                     },
    //                 };

    //                 this.setState({ fetchedPhotos });
    //             },
    //             complete: () => {
    //                 this.setState({ downloadComplete: true });
    //                 console.log('ALL DOWNLOADS COMPLETED!');
    //             },
    //         });
    //     }
    // }

    handleInputChange(e) {
        this.setState({ input: e.target.value });
    }

    async handleFileUpload(e) {
        if (e.file.status === 'done') {
            const fileObj: File = e.file.originFile || e.file.originFileObj;
            const b64: string = await getBase64(fileObj);
            console.log({ b64 });
            const exifData = await getExif(b64);
            console.log({ exifData });

            const metaData = { title: fileObj.name, archived: false, trashed: false };
            let postRes = await postPhotos([{ metaData, b64 }]);
            console.log({ postRes });
            if (postRes.status === 'success') {
                let $postPhotos = postRes.data.$postPhotos;
                let photoIds = postRes.data.photoIds;
                console.log('Uploading $postPhotos', $postPhotos);
                console.log('UPLOADING PHOTO IDS: ', photoIds);
                $postPhotos.subscribe({
                    next: res => {
                        console.log('PHOTO UPLOADED: ', res.photoId);
                        // I hope we're not using too much memory keeping all of fileObj in this closure
                        postMiniPhoto(fileObj, res.photoId).then((resp: PhotoResponse) => {
                            console.log({ resp });
                        });
                    },
                    complete: () => {
                        console.log('ALL PHOTOS UPLOADED!');
                    },
                });
            }
        }
    }

    async handleTest(e) {
        // var img1 = document.querySelector('img');
        // EXIF.getData(img1, function() {
        //     var tags = EXIF.getAllTags(this);
        //     console.log({ tags });
        // });
        // return;

        let deleteRes = await deletePhoto(this.state.input);
        console.log({ deleteRes });
    }

    render() {
        const { downloadComplete, fetchedPhotos, uploadError } = this.state;
        const transformedData = Object.values(fetchedPhotos);

        return (
            <div>
                <div className="photos"></div>
                {uploadError && (
                    <Alert style={{ marginTop: '30px', marginBottom: '20px' }} message={uploadError} type="error" />
                )}
                <div>
                    <PhotoGrid
                        deletePhoto={deletePhoto}
                        downloadComplete={downloadComplete}
                        photos={transformedData}></PhotoGrid>
                </div>
                <div style={{ marginTop: '24px' }}>
                    <Upload listType="picture" multiple onChange={this.handleFileUpload}>
                        <Button>
                            <Icon type="upload" /> Upload
                        </Button>
                    </Upload>
                </div>
                {/* <div style={{ marginTop: '24px' }}>
                    <Button onClick={this.handleTest}>Test</Button>
                </div>

                <input onChange={e => this.setState({ input: e.target.value })} type="text" /> */}
                <UploadOverlay></UploadOverlay>
            </div>
        );
    }
}

export default PhotoScreen;
