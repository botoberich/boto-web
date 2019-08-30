import { Subject } from 'rxjs';
import React from 'react';

export interface IPhotoContext {
    selectedThumbnails: string[];
    setSelectedThumbnails: React.Dispatch<React.SetStateAction<string[]>>;
    thumbnails: { [date: string]: { [photoId: string]: IThumbnail } };
    setThumbnails: React.Dispatch<React.SetStateAction<{ [date: string]: { [photoId: string]: IThumbnail } }>>;
    loadingThumbnails: string[];
    setloadingThumbnails: React.Dispatch<React.SetStateAction<string[]>>;
    loadingLightBox: boolean;
    setLoadingLightBox: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IPhotoMetadata {
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
    metaData: IPhotoMetadata;
}

export interface IPostPhotosResult {
    allMetadata: IPhotoMetadata[];
    $photos: Subject<IThumbnail>;
}
export interface IDeletePhotosResult {
    photoIds: string[];
    $deletes: Subject<IPhotoMetadata>;
}
export interface IGetOwnThumbnailsResult {
    allMetadata: IPhotoMetadata[];
    $thumbnails: Subject<IThumbnail>;
}
export interface IThumbnail {
    b64: string;
    metaData: IPhotoMetadata;
}
