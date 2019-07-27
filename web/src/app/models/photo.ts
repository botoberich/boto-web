import { Model } from 'radiks';

class Photo extends Model {
    static className = 'Photo';

    static schema = {
        albumId: {
            type: String,
            decrypted: true,
        },
        title: String,
        archived: Boolean,
        trashed: Boolean,
        chunked: Boolean,
        lat: Number,
        long: Number,
    };
}

export default Photo;
