import EXIF from 'exif-js';
import { getBase64 } from './encoding';
import { PhotoMetaData } from '../interfaces/photos.interface';

export const getExif = b64 => {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = function() {
            EXIF.getData(image, function() {
                resolve(EXIF.getAllTags(this));
            });
        };
        image.src = `data:image/jpeg;base64,${b64}`;
    });
};

export const getPhotoMetaData = async (file): Promise<{ base: PhotoMetaData; exif: any }> => {
    let b64 = await getBase64(file);
    let exif = await getExif(b64);
    let base = {
        title: file.name,
        archived: false,
        trashed: false,
    };
    return { base, exif };
};
