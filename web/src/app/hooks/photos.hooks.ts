import React from 'react';
import { getOwnPhotos, postPhotos, deletePhoto, postMiniPhoto, getMiniPhotos } from '../services/photo.service';
import { getBase64 } from '../utils/encoding';
import { PhotoResponse } from '../utils/apiResponse';
import { getExif } from '../utils/exif';

export const useFileUpload = (e, callback) => {
    async function run(e) {
        console.log('file upload event', e);
        if (e.file.status === 'done') {
            const fileObj: File = e.file.originFile || e.file.originFileObj;
            const b64: string = await getBase64(fileObj);
            console.log({ b64 });
            const exifData = await getExif(b64);
            console.log({ exifData });

            const metaData = { title: fileObj.name, archived: false, trashed: false };
            console.log('post meta data', { metaData });
            let postRes = await postPhotos([{ metaData, b64 }]);
            console.log('post res:', { postRes });
            if (postRes.status === 'success') {
                let $postPhotos = postRes.data.$postPhotos;
                let photoIds = postRes.data.photoIds;

                // Keep the original photo Id for our mini photo
                postMiniPhoto(fileObj, photoIds[0]).then((resp: PhotoResponse) => {
                    console.log({ resp });
                });

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
                        callback();
                    },
                });
            }
        }
    }

    run(e);
};
