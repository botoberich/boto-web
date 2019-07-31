import EXIF from 'exif-js';

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
