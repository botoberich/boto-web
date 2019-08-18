import React from 'react';
import { postPhotos, deletePhotos, getThumbnails } from '../services/photo.service';
import { getPhotoMetaData } from '../utils/metadata';
import { ProgressStartingPayload } from '../interfaces/ui.interface';

/** @todo use the one from interfaces/photos.interface.ts */
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
                const $thumbnails = getRes.data.$thumbnails;
                $thumbnails.subscribe({
                    next: res => {
                        setThumbnails(thumbnails => [
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
    {
        onNext = (id: string) => {},
        onComplete = () => {},
        onError = err => {},
        onStart = () => {},
        onEnd = () => {},
    } = {}
) => {
    console.log('DELETING PHOTO IDS:', ids);
    onStart();
    const deleteRes = await deletePhotos(ids);
    if (deleteRes.status === 'success') {
        deleteRes.data.$deletes.subscribe({
            next: id => {
                console.log('Deleted photo id: ', id);
                onNext(id);
            },
            error: err => {
                console.log('Delete photo err: ', err);
                onError(err);
                onEnd();
            },
            complete: () => {
                console.log('Deletes Completed.');
                onComplete();
                onEnd();
            },
        });
    } else {
        console.log('Error: ', deleteRes.data);
        onError(deleteRes.data);
        onEnd();
    }
};

export const handleFileUpload = async (
    e,
    {
        onNext = (id: string) => {},
        onComplete = () => {},
        onError = err => {},
        onStart = (payload: ProgressStartingPayload) => {},
        onEnd = () => {},
    } = {}
) => {
    const files: File[] = [...e.target.files];
    onStart({
        length: files.length,
        cmd: 'Upload',
    });
    const postRes = await postPhotos(files);
    if (postRes.status === 'success') {
        const $postPhotos = postRes.data.$photos;
        $postPhotos.subscribe({
            next: res => {
                console.log('Uploaded photo id: ', res.photoId);
                onNext(res.photoId);
            },
            error: err => {
                console.log('Upload error: ', err);
                onError(err);
                onEnd();
            },
            complete: () => {
                console.log('Uploads completed.');
                onComplete();
                onEnd();
            },
        });
    } else {
        console.log('Error: ', postRes.data);
        onError(postRes.data);
        onEnd();
    }
};
