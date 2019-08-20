import { Subject } from 'rxjs';
import { ResponseStatus } from './response.interface';

export interface PhotoMetaData {
    archived: boolean;
    title: string;
    trashed: boolean;
    updatedAt?: number;
    createdAt?: number;
    _id?: string;
    exif?: string;
}

export interface Photo {
    b64: string;
    metaData: PhotoMetaData;
}

export interface PostPhotosResult {
    photoIds: string[];
    $photos: Subject<Thumbnail>;
}
export interface DeletePhotosResult {
    photoIds: string[];
    $deletes: Subject<PhotoMetaData>;
}
export interface GetThumbnailsResult {
    photoIds: string[];
    $thumbnails: Subject<Thumbnail>;
}
export interface Thumbnail {
    photoId: string;
    b64: string;
    metaData: PhotoMetaData;
}
