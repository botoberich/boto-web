import Model from 'radiks';
class Chunk extends Model {
    constructor(...args) {
        super(...args);
    }

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
