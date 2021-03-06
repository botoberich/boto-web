import { postPhotos, deletePhotos, getThumbnails, getPhotoById } from '../../services/photo.service';
import { ProgressStartingPayload } from '../../interfaces/ui.interface';
import { IThumbnail, IPhotoMetadata } from '../../interfaces/photos.interface';
import uuid from 'uuid/v4';

type Photo = {
    src: string;
    title: string;
};

export const handleDownloadPhotos = async (useServer: boolean = false, ids: string[]) => {
    if (ids !== undefined && ids.length <= 0) return;
    try {
        const photoResponse = await Promise.all(ids.map(id => getPhotoById(useServer, id)));
        const files = photoResponse
            .map(res => {
                if (res.status === 'success') {
                    return { src: `${res.data.b64}`, title: res.data.metaData.title };
                }
                return null;
            })
            .filter(src => src !== null);
        triggerDownload(files);
    } catch (e) {
        throw new Error(`Error downloading photos: ${e}`);
    }
};

async function triggerDownload(photos: Photo[]) {
    if (photos === undefined) return;
    // If it's a single photo, trigger download without zipping file
    /** @todo Single download fails when the file size is big - for now just put it in a zip */
    // if (photos.length === 1 && photos[0].src !== '') {
    //     const photo = photos[0];
    //     const title = removeFileExtension(photo.title);
    //     generateDownloadable(`data:image/png;base64,${photo.src}`, `${title}.png`);
    // } else {
    // Create a zip file and download it
    const [jszip, filesaver] = await Promise.all([import('jszip'), import('file-saver')]);
    const zip = new jszip.default();
    const saveAs = filesaver.saveAs;
    photos.forEach(photo => {
        const title = removeFileExtension(photo.title);
        zip.file(`${title}.png`, photo.src, { base64: true });
    });
    const zipFileName = `boto-${uuid().slice(0, 6)}.zip`;
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, zipFileName);
    // }
}

function removeFileExtension(title) {
    const splitTitle = title.split('.');
    return splitTitle.slice(0, splitTitle.length - 1).join('');
}

// TODO: Fix single photo downloads
// function generateDownloadable(source, name) {
//     const downloadableContent = document.createElement('a');
//     downloadableContent.download = name;
//     downloadableContent.href = source;
//     document.body.appendChild(downloadableContent);
//     downloadableContent.click();
//     document.body.removeChild(downloadableContent);
// }

export const handleFetchThumbnails = async (
    isServer: boolean = false,
    {
        onNext = (thumbnail: IThumbnail) => {},
        onComplete = () => {},
        onError = err => {},
        onEnd = () => {},
        onStart = (allMetadata: IPhotoMetadata[]) => {},
    } = {}
) => {
    let subscription = { unsubscribe: () => {} };
    const thumbnailsRes = await getThumbnails(isServer);
    onStart(thumbnailsRes.data.allMetadata);
    if (thumbnailsRes.status === 'success') {
        subscription = thumbnailsRes.data.$thumbnails.subscribe({
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
        console.error('Error: ', thumbnailsRes.data);
        onError(thumbnailsRes.data);
        onEnd();
    }

    return subscription;
};

export const handleDeletePhotos = async (
    useServer: boolean = false,
    ids: string[],
    {
        onNext = (id: IPhotoMetadata) => {},
        onComplete = () => {},
        onError = err => {},
        onStart = (payload: ProgressStartingPayload) => {},
        onEnd = () => {},
    } = {}
) => {
    if (ids.length <= 0) {
        return;
    }

    onStart({
        length: ids.length,
        cmd: 'Delete',
    });

    const deleteRes = await deletePhotos(useServer, ids);
    if (deleteRes.status === 'success') {
        deleteRes.data.$deletes.subscribe({
            next: metaData => {
                onNext(metaData);
            },
            error: err => {
                console.error('Delete photo err: ', err);
                onError(err);
                onEnd();
            },
            complete: () => {
                onComplete();
                onEnd();
            },
        });
    } else {
        console.error('Error: ', deleteRes.data);
        onError(deleteRes.data);
        onEnd();
    }
};

export const handleFileUpload = async (
    useServer: boolean = false,
    e,
    {
        onNext = (res: IThumbnail) => {},
        onComplete = () => {},
        onError = err => {},
        onStart = (payload: ProgressStartingPayload) => {},
        onEnd = () => {},
    } = {}
) => {
    const files: File[] = [...e.target.files];
    e.target.value = '';
    onStart({
        length: files.length,
        cmd: 'Upload',
    });
    const postRes = await postPhotos(useServer, files);
    if (postRes.status === 'success') {
        const $postPhotos = postRes.data.$photos;
        $postPhotos.subscribe({
            next: res => {
                onNext(res);
            },
            error: err => {
                console.error('Upload error: ', err);
                onError(err);
                onEnd();
            },
            complete: () => {
                onComplete();
                onEnd();
            },
        });
    } else {
        console.error('Error: ', postRes.data);
        onError(postRes.data);
        onEnd();
    }
};
