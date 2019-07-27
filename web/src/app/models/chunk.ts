import { Model } from 'radiks';

class Chunk extends Model {
    static className = 'Chunk';
    static schema = {
        photoId: {
            type: String,
            decrypted: true,
        },
        chunkNumber: Number,
    };
}

export default Chunk;
