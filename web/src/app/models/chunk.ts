import { Model } from 'radiks';

class Chunk extends Model {
    static className = 'Chunk';
    static schema = {
        chunkNumber: Number,
        photoId: {
            type: String,
            decrypted: true,
        },
    };
}

export default Chunk;
