import EncodingWorker from './encoding.worker';
const worker = typeof window !== 'undefined' && EncodingWorker();

export const getBase64 = fileObj => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileObj);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const getBlob = async (fileObj, contentType = '', sliceSize = 512) => {
    const b64Data = await getBase64(fileObj);
    let blob;
    if (worker) {
        blob = await worker.getBlob(b64Data, contentType, sliceSize);
    }
    return blob;
};

export const getChunkedBlobs = async (blob, limit) => {
    let chunks;
    if (worker) {
        chunks = await worker.getChunkedBlobs(blob, limit);
    }
    return chunks;
};

export const getBlobAsText = async blob => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

export const chunkB64 = (b64, chunkSize) => {
    let chunks;
    if (worker) {
        chunks = worker.chunkB64(b64, chunkSize);
    }
    return chunks;
};
