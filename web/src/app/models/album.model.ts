import { Model } from 'radiks/src';

// Notes: having an array of strings doesn't seem to be supported yet for the model structure

class Album extends Model {
    static className = 'Album';
    static schema = {
        description: String,
        title: String,
        coverId: {
            type: String,
            decrypted: true,
        },
    };
}

export default Album;
