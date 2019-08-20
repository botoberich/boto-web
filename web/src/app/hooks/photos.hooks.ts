import { postPhotos, deletePhotos, getThumbnails, getPhotoById } from '../services/photo.service';
import { ProgressStartingPayload } from '../interfaces/ui.interface';
import { Thumbnail, PhotoMetaData } from '../interfaces/photos.interface';

type Photo = {
    src: string;
    title: string;
};

export const handleDownloadPhotos = async (ids: string[]) => {
    if (ids !== undefined && ids.length <= 0) return;
    try {
        const photoResponse = await Promise.all(ids.map(id => getPhotoById(id)));
        const files = photoResponse
            .map(res => {
                if (res.status === 'success') {
                    console.log(res.data);
                    return { src: `data:image/png;base64,${res.data.b64}`, title: res.data.metaData.title };
                }
                return null;
            })
            .filter(src => src !== null);
        triggerDownload(files);
    } catch (e) {
        console.error('Error downloading photos', e);
    }
};

function triggerDownload(photos: Photo[]) {
    if (photos === undefined) return;

    // If it's a single photo, trigger download without zipping file
    if (photos.length === 1 && photos[0].src !== '') {
        const photo = photos[0];
        const downloadableImg = document.createElement('a');
        const splitTitle = photo.title.split('.');
        const title = splitTitle.slice(0, splitTitle.length - 1).join('');
        downloadableImg.download = `${title}.png`;
        downloadableImg.href = photo.src;
        document.body.appendChild(downloadableImg);
        downloadableImg.click();
        document.body.removeChild(downloadableImg);
    } else {
        console.log('Multi zip folder');
    }
}

// const handleDownload = React.useCallback(async () => {
//     if (deleting) return;
//     if (photoDownloading) return;
//     const downloadableImg = document.createElement('a');
//     downloadableImg.download = `${id}.jpg`;
//     downloadableImg.href = originalSrc.current;
//     document.body.appendChild(downloadableImg);
//     downloadableImg.click();
//     document.body.removeChild(downloadableImg);
// }, [deleting, id, photoDownloading]);

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
