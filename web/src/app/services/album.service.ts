import {
    IAlbumMetadata,
    ICreateAlbumResult,
    IAddToAlbumResult,
    IRemoveFromAlbumResult,
    IGetAlbumsResult,
    IGetSingleAlbumResult,
} from '../interfaces/albums.interface';
import Album from '../models/album.model';
import uuid from 'uuid/v4';
import Photo from '../models/photo.model';
import { success, error } from '../utils/apiResponse';
import { mergeAll } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { ApiResponse } from '../interfaces/response.interface';
import { Model } from 'radiks/src';
import { deletePhotos, getThumbnail } from './photo.service';
import { PhotoModel } from '../models';

const getPhotosByAlbumId = async (albumId): Promise<PhotoModel[]> => {
    try {
        let ownPhotos = await Photo.fetchOwnList();
        let photos = ownPhotos.filter(photo => JSON.parse(photo.attrs.albumIds || '[]').some(id => id === albumId));
        return photos;
    } catch (err) {
        throw new Error(err);
    }
};

export const createAlbum = async (photoIds: string[], albumMetadata: IAlbumMetadata): Promise<ApiResponse<ICreateAlbumResult>> => {
    try {
        let albumId = uuid();
        let album = new Album({
            _id: albumId,
            coverId: photoIds[0],
            ...albumMetadata,
        });

        let saveRes: any = await album.save();
        let addPhotosRes = await addToAlbum(photoIds, albumId);
        if (addPhotosRes.status === 'success') {
            return success({ albumMetadata: saveRes.attrs, $photos: addPhotosRes.data.$photos });
        } else {
            return error(addPhotosRes.data);
        }
    } catch (err) {
        return error(err);
    }
};

export const addToAlbum = async (photoIds, albumId): Promise<ApiResponse<IAddToAlbumResult>> => {
    try {
        let album = await Album.findById(albumId);
        if (!album) {
            throw new Error(`Album ${albumId} doesn't exist.`);
        }
        let photos = await Promise.all(photoIds.map(id => Photo.findById(id)));
        let addPhotos = photos.map((photo: Model) => {
            let albumIds = JSON.parse(photo.attrs.albumIds || `[]`);
            let newAlbumIds = new Set([...albumIds, albumId]);
            if (photo) {
                photo.update({
                    albumIds: JSON.stringify([...newAlbumIds]),
                });
                return photo.save();
            }
        });

        let $photos = of.apply(this, addPhotos).pipe(mergeAll());
        return success({ albumMetadata: album.attrs, $photos });
    } catch (err) {
        return error(err);
    }
};

// TODO: Remove the coverId if the album is empty
export const removeFromAlbum = async (photoIds, albumId): Promise<ApiResponse<IRemoveFromAlbumResult>> => {
    try {
        let album = await Album.findById(albumId);
        if (!album) {
            throw new Error(`Album ${albumId} doesn't exist.`);
        }
        let photos = await Promise.all(photoIds.map(id => Photo.findById(id)));
        let removePhotos = photos.map((photo: Model) => {
            let albumIds = JSON.parse(photo.attrs.albumIds || `[]`);
            let newAlbumIds = new Set([...albumIds]);
            newAlbumIds.delete(albumId);
            if (photo) {
                photo.update({
                    albumIds: JSON.stringify([...newAlbumIds]),
                });
                return photo.save();
            }
        });
        let $photos = of.apply(this, removePhotos).pipe(mergeAll());
        return success({ albumMetadata: album.attrs, $photos });
    } catch (err) {
        return error(err);
    }
};

export const getAlbums = async (): Promise<ApiResponse<IGetAlbumsResult>> => {
    try {
        let albums = await Album.fetchOwnList();
        let albumsMap = {};
        albums.forEach(album => (albumsMap[album._id] = album.attrs));
        return success(albumsMap);
    } catch (err) {
        return error(err);
    }
};

export const getAlbumById = async (albumId): Promise<ApiResponse<IGetSingleAlbumResult>> => {
    try {
        let [album, photos] = await Promise.all([Album.findById(albumId), getPhotosByAlbumId(albumId)]);
        let photosMap = {};
        photos.forEach(photo => (photosMap[photo._id] = photo.attrs));
        return success({ photos, albumMetadata: album.attrs });
    } catch (err) {
        return error(err);
    }
};

export const updateAlbumMetadata = async (albumId: string, newMetadata: IAlbumMetadata): Promise<ApiResponse<IAlbumMetadata>> => {
    try {
        let album = await Album.findById(albumId);
        album.update({
            ...album.attrs,
            ...newMetadata,
        });
        let saveRes: any = await album.save();
        return success(saveRes.attrs);
    } catch (err) {
        return error(err);
    }
};

export const deleteAlbum = async (useServer: boolean, albumId: string, keepPhotos: boolean): Promise<ApiResponse<IAlbumMetadata>> => {
    try {
        let album = await Album.findById(albumId);
        await album.destroy();
        if (!keepPhotos) {
            let photos = await getPhotosByAlbumId(albumId);
            let photoIds = photos.map(photo => photo._id);
            await deletePhotos(useServer, photoIds);
        }
        return success(album.attrs);
    } catch (err) {
        return error(err);
    }
};
