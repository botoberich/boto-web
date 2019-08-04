import React from 'react';

// UI
import { Alert, Upload, Button, Icon } from 'antd';
import PhotoGrid from '../components/PhotoGrid';
import UploadOverlay from '../components/UploadOverlay';
import 'react-image-lightbox/style.css';

// State
import { getExif } from '../utils/exif';
import { getOwnPhotos, postPhotos, deletePhoto } from '../services/photo';
import { getBase64 } from '../utils/encoding';

class Photo extends React.Component {
    constructor(props) {
        super(props);

        this.photoService = null;
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleTest = this.handleTest.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            uploadError: null,
            fetchedPhotos: [],
            input: '',
        };
    }

    async componentDidMount() {
        let res = await getOwnPhotos();
        console.log({ res });
        /**
         * The photo ids in each metadata object from the response should be used to initialize all loading photos by id
         * So, when the $photo observable streams {photoId, b64}, you know where to load the b64
         */

        if (res.status === 'success') {
            const { metaData } = res.data;

            // Create a prefilled hash-map for the in-flight photos
            const pendingPhotos = Array(metaData.length)
                .fill({})
                .reduce((photos, _, index) => {
                    return {
                        ...photos,
                        [metaData[index]._id]: {
                            src: null,
                            title: metaData[index].title,
                            id: metaData[index]._id,
                        },
                    };
                }, {});

            this.setState({ fetchedPhotos: pendingPhotos });

            const $photos = res.data.$photos;
            $photos.subscribe({
                next: ({ photoId, b64 }) => {
                    console.log('PHOTO DOWNLOADED:', { photoId, b64 });

                    // Replace the corresponding photo placeholder with the newly fetched photos
                    // const fetchedPhotos = { ...this.state.fetchedPhotos };
                    // fetchedPhotos[photoId] = {
                    //     id: photoId,
                    //     src: b64,
                    // };

                    this.setState({
                        fetchedPhotos: {
                            ...this.state.fetchedPhotos,
                            [photoId]: {
                                id: photoId,
                                src: b64,
                            },
                        },
                    });
                },
                complete: () => {
                    console.log('ALL DOWNLOADS COMPLETED!');
                },
            });
        }
    }

    handleInputChange(e) {
        this.setState({ input: e.target.value });
    }

    async handleFileUpload(e) {
        if (e.file.status === 'done') {
            const fileObj = e.file.originFile || e.file.originFileObj;
            const b64 = await getBase64(fileObj);
            console.log({ b64 });
            const exifData = await getExif(b64);
            console.log({ exifData });

            const metaData = { title: fileObj.name, archived: false, trashed: false };
            let postRes = await postPhotos([{ metaData, b64 }]);
            console.log({ postRes });
            if (postRes.status === 'success') {
                let $postPhotos = postRes.data.$postPhotos;
                let photoIds = postRes.data.photoIds;
                console.log('UPLOADING PHOTO IDS: ', photoIds);
                $postPhotos.subscribe({
                    next: res => {
                        console.log('PHOTO UPLOADED: ', res.photoId);
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
        const { uploadError, fetchedPhotos } = this.state;
        const normalizedPhotos = Object.values(fetchedPhotos);
        console.log({ normalizedPhotos });
        let test = [{ src: null, id: '5123424' }];

        return (
            <div>
                <div className="photos"></div>

                {uploadError && (
                    <Alert style={{ marginTop: '30px', marginBottom: '20px' }} message={uploadError} type="error" />
                )}

                <div>{<PhotoGrid photos={test}></PhotoGrid>}</div>

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

export default Photo;
