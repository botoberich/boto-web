import { Model } from 'radiks';

/**
 * We might not need this model at all.
 * We can set a flag in photo.model.ts - compressed: true
 * If a photo is compressed then fetch from gaia the compressed version - gaiapath/{photoid}/compressed
 */
class MiniPhoto extends Model {
    constructor(...args) {
        super(...args);
    }

    static className = 'MiniPhoto';

    static schema = {
        albumId: {
            type: String,
            decrypted: true,
        },
        photoId: String /** PhotoId needs to be decrypted true when you fetch you need this to index into Gaia */,
        src: String,
    };
}

export default MiniPhoto;
