import { Model } from 'radiks/src';
class Photo extends Model {
    constructor(...args) {
        super(...args);
    }

    static className = 'Photo';

    static schema = {
        albumId: {
            type: String,
            decrypted: true,
        },
        archived: Boolean,
        chunked: Boolean,
        title: String,
        trashed: Boolean,
        lat: Number,
        lng: Number,
        exif: String,
    };
}

export default Photo;
