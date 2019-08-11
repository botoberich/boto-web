import Model from 'radiks';
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
        compressed: String,
        title: String,
        trashed: Boolean,
        lat: Number,
        lng: Number,
    };
}

export default Photo;
