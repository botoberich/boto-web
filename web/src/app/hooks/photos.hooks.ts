import React from 'react';
// import { getBase64 } from '../utils/encoding';
// import { PhotoResponse } from '../utils/apiResponse';
// import { getExif } from '../utils/exif';
import { getPhotoById, postPhotos, deletePhotos, getThumbnails } from '../services/photo.service';

export type Thumbnail = {
    id: string;
    src: string;
};

export const useGetThumbnails = () => {
    const [thumbnails, setThumbnails] = React.useState<Thumbnail[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | boolean>(null);

    React.useEffect(() => {
        async function run() {
            setLoading(true);
            const getRes = await getThumbnails();
            if (getRes.status === 'success') {
                let $thumbnails = getRes.data.$thumbnails;
                $thumbnails.subscribe({
                    next: res => {
                        console.log(`Thumbnail downloaded for photo: ${res}`);
                        setThumbnails([
                            ...thumbnails,
                            {
                                id: res.photoId,
                                src: `data:image/png;base64,${res.b64}`,
                            },
                        ]);
                    },
                    error: err => {
                        console.log(`Error downloading thumbnail: ${err}`);
                        setLoading(false);
                        setError(err);
                    },
                    complete: () => {
                        setLoading(false);
                        console.log(`Thumbnails download completed.`);
                    },
                });
            } else {
                setError(true);
                console.log(`Error downloading thumbnail: ${getRes.data}`);
            }
        }

        run();
    }, []);

    return { data: thumbnails, loading, error };
};

export const handleDeletePhotos = async (
    ids: string[],
    { onNext = (id: string) => {}, onComplete = () => {}, onError = err => {}, onLoading = (state: boolean) => {} } = {}
) => {
    console.log('DELETING PHOTO IDS:', ids);
    onLoading(true);
    let deleteRes = await deletePhotos(ids);
    if (deleteRes.status === 'success') {
        deleteRes.data.$deletes.subscribe({
            next: id => {
                console.log('Deleted photo id: ', id);
                onNext(id);
            },
            error: err => {
                console.log('Delete photo err: ', err);
                onError(err);
                onLoading(false);
            },
            complete: () => {
                console.log('Deletes Completed.');
                onComplete();
                onLoading(false);
            },
        });
    } else {
        console.log('Error: ', deleteRes.data);
        onError(deleteRes.data);
        onLoading(false);
    }
};

export const handleFileUpload = async (
    e,
    { onNext = (id: string) => {}, onComplete = () => {}, onError = err => {}, onLoading = (state: boolean) => {} } = {}
) => {
    if (e.file.status === 'done') {
        const file: File = e.file.originFile || e.file.originFileObj;
        const metaData = { title: file.name, archived: false, trashed: false };

        onLoading(true);
        let postRes = await postPhotos([{ metaData, file }]);
        if (postRes.status === 'success') {
            let $postPhotos = postRes.data.$photos;
            // let photoIds = postRes.data.photoIds;

            $postPhotos.subscribe({
                next: res => {
                    console.log('Uploaded photo id: ', res.photoId);
                    onNext(res.photoId);
                },
                error: err => {
                    console.log('Upload error: ', err);
                    onError(err);
                    onLoading(false);
                },
                complete: () => {
                    console.log('Uploads completed.');
                    onComplete();
                    onLoading(false);
                },
            });
        } else {
            console.log('Error: ', postRes.data);
            onError(postRes.data);
            onLoading(false);
        }
    }
};

// export const useFetch = (url, options) => {
//     const [response, setResponse] = React.useState(null);
//     const [error, setError] = React.useState(null);
//     React.useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await fetch(url, options);
//                 const json = await res.json();
//                 setResponse(json);
//             } catch (error) {
//                 setError(error);
//             }
//         };
//         fetchData();
//     }, []);
//     return { response, error };
// };
