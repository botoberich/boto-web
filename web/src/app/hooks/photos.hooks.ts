import { postPhotos, deletePhotos, getThumbnails } from '../services/photo.service';
import { ProgressStartingPayload } from '../interfaces/ui.interface';
import { Thumbnail, PhotoMetaData } from '../interfaces/photos.interface';

export const handleDownloadPhotos = async () => {};

export const handleFetchThumbnails = async ({
    onNext = (thumbnail: Thumbnail) => {},
    onComplete = () => {},
    onError = err => {},
    onEnd = () => {},
} = {}) => {
    const thumbnailsRes = await getThumbnails();
    if (thumbnailsRes.status === 'success') {
        thumbnailsRes.data.$thumbnails.subscribe({
            next: res => {
                onNext(res);
            },
            error: err => {
                onError(err);
                onEnd();
            },
            complete: () => {
                onComplete();
                onEnd();
            },
        });
    } else {
        console.log('Error: ', thumbnailsRes.data);
        onError(thumbnailsRes.data);
        onEnd();
    }
};

export const handleDeletePhotos = async (
    ids: string[],
    {
        onNext = (id: PhotoMetaData) => {},
        onComplete = () => {},
        onError = err => {},
        onStart = (payload: ProgressStartingPayload) => {},
        onEnd = () => {},
    } = {}
) => {
    onStart({
        length: ids.length,
        cmd: 'Delete',
    });

    const deleteRes = await deletePhotos(ids);
    if (deleteRes.status === 'success') {
        deleteRes.data.$deletes.subscribe({
            next: metaData => {
                console.log('Deleted photo id: ', metaData._id);
                onNext(metaData);
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
        onNext = (res: Thumbnail) => {},
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
                onNext(res);
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
