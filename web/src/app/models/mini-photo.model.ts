import { Model } from 'radiks';

class MiniPhoto extends Model {
    static className = 'MiniPhoto';

    static schema = {
        albumId: {
            type: String,
            decrypted: true,
        },
        photoId: String,
        src: String,
    };
}

export default MiniPhoto;
