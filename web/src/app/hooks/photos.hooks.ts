import React from 'react';
// import { getBase64 } from '../utils/encoding';
// import { PhotoResponse } from '../utils/apiResponse';
// import { getExif } from '../utils/exif';
import { getPhotoById, postPhotos, deletePhotos, getThumbnails } from '../services/photo.service';

export type Thumbnail = {
    id: string;
    src: string;
};

// export const useGetPhotoById = (id) => {
//     let getRes = await getPhotoById(this.state.photoId);
//         console.log({ getRes });
// }

export const useDeletePhotos = (ids: string[]) => {
    const [success, setSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | boolean>(null);

    React.useEffect(() => {
        async function run() {
            console.log('DELETING PHOTO IDs:', ids);
            setLoading(true);
            let deleteRes = await deletePhotos(ids);
            if (deleteRes.status === 'success') {
                deleteRes.data.$deletes.subscribe({
                    next: id => {
                        // We're only deleting one photo at a time right now, so it's only to just track
                        // success for the entire subscription. Later, a new method needs to be devised. Maybe a map
                        setSuccess(true);
                        console.log('Deleted photo id: ', id);
                    },
                    error: err => {
                        setError(err);
                        console.log('Delete photo err: ', err);
                    },
                    complete: () => {
                        setLoading(false);
                        console.log('Deletes Completed.');
                    },
                });
            } else {
                setLoading(false);
                setError(true);
                console.log('Error: ', deleteRes.data);
            }
        }

        run();
    }, []);

    return { success, error, loading };
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
                                src: res.b64,
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

export const handleFileUpload = async e => {
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
