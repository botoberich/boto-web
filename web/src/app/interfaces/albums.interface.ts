import { Subject } from 'rxjs';
import { PhotoModel } from '../models';
import { IPhotoMetadata } from './photos.interface';

export interface IAlbumMetadata {
    _id?: string;
    createAt?: number;
    updatedAt?: number;
    title?: string;
    description?: string;
    coverId?: string;
}

export interface ICreateAlbumResult {
    albumMetadata: IAlbumMetadata;
    $photos: Subject<PhotoModel>;
}

export interface IAddToAlbumResult {
    albumMetadata: IAlbumMetadata;
    $photos: Subject<PhotoModel>;
}

export interface IRemoveFromAlbumResult {
    albumMetadata: IAlbumMetadata;
    $photos: Subject<PhotoModel>;
}

export interface IGetAlbumsResult {
    albums: { [albumId: string]: IAlbumMetadata };
}
export interface IGetSingleAlbumResult {
    albumData: { photos: { [photoId: string]: IPhotoMetadata }; albumMetadata: IAlbumMetadata };
}
