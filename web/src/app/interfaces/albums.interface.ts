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

export interface ICreateAlbumFormData {
    title: string;
    description: string;
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

export interface IAlbumsMetadata {
    albums: { [albumId: string]: IAlbumMetadata };
}
export interface IAlbum {
    photos: IPhotoMetadata[];
    albumMetadata: IAlbumMetadata;
}
