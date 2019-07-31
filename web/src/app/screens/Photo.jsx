import React from 'react';
import { Alert, Upload, Button, Icon } from 'antd';
import { getOwnPhotos, postPhotos, deletePhoto } from '../services/photo.ts';
import { getBase64 } from '../utils/encoding';
import PhotoGrid from '../components/PhotoGrid';
import UploadOverlay from '../components/UploadOverlay';
import { getExif } from '../utils/exif';

class Photo extends React.Component {
    constructor(props) {
        super(props);

        this.photoService = null;
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleTest = this.handleTest.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            uploadError: null,
            myPhotos: [],
            input: '',
        };
    }

    async componentDidMount() {
        let res = await getOwnPhotos();
        /**
         * The photo ids in each metadata object from the response should be used to initialize all loading photos by id
         * So, when the $photo observable streams {photoId, b64}, you know where to load the b64
         */

        if (res.status === 'success') {
            let $photos = res.data.$photos;
            $photos.subscribe({
                next: photo => {
                    console.log('PHOTO DOWNLOADED:', photo);
                    this.setState({ myPhotos: [photo, ...this.state.myPhotos] });
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
            const exifData = await getExif(b64);
            console.log({ exifData });

            const metaData = { title: fileObj.name, archived: false, trashed: false };
            let postRes = await postPhotos([{ metaData, b64 }]);
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

    renderPhoto(b64, i) {
        /** just temporary to test if my images are being uploaded and pulled correctly, remove this and put the photos in photogrid*/
        return (
            <img
                key={i}
                alt="DEFAULT_IMAGE"
                style={{ width: 'auto', height: '300px', marginRight: '15px' }}
                src={b64}
            ></img>
        );
    }

    render() {
        const { uploadError } = this.state;

        return (
            <div>
                <div className="photos"></div>

                {uploadError && (
                    <Alert style={{ marginTop: '30px', marginBottom: '20px' }} message={uploadError} type="error" />
                )}

                <div className="photos">
                    {this.state.myPhotos.map((photo, i) => this.renderPhoto(`data:image/jpeg;base64,${photo.b64}`, i))}
                </div>

                <div>
                    {/* Leave this part in for demo purposes -- DD 07/22/19 */}
                    <PhotoGrid />
                </div>

                <div style={{ marginTop: '24px' }}>
                    <Upload listType="picture" onChange={this.handleFileUpload}>
                        <Button>
                            <Icon type="upload" /> Upload
                        </Button>
                    </Upload>
                </div>

                <div style={{ marginTop: '24px' }}>
                    <Button onClick={this.handleTest}>Test</Button>
                </div>

                <input onChange={e => this.setState({ input: e.target.value })} type="text" />

                <UploadOverlay></UploadOverlay>
            </div>
        );
    }
}

export default Photo;
