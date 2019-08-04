export const getBlob = async (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {
        type: contentType,
    });

    return blob;
};

export const getChunkedBlobs = (blob, limit) => {
    if (blob.size <= limit) {
        return [blob];
    } else {
        let multiple = Math.floor(blob.size / limit);
        let chunks = [];
        for (let i = 0; i < multiple; i++) {
            chunks.push(blob.slice(i * limit, (i + 1) * limit));
        }
        chunks.push(blob.slice(multiple * limit, blob.size));
        return chunks;
    }
};

export const chunkB64 = (b64, chunkSize) => {
    let chunks = [];
    for (let i = 0; i < b64.length; i += chunkSize) {
        let chunk = b64.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    return chunks;
};
