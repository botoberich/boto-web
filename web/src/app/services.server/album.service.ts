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
import { of } from 'rxjs';
import { ApiResponse } from '../interfaces/response.interface';
import { Model } from 'radiks/src';
import { deletePhotos } from './photo.service';

export const createAlbum = async (
    photoIds: string[],
    albumMetadata: IAlbumMetadata
): Promise<ApiResponse<ICreateAlbumResult>> => {
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
            if (photo) {
                photo.update({
                    albumId,
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

export const removeFromAlbum = async (photoIds, albumId): Promise<ApiResponse<IRemoveFromAlbumResult>> => {
    try {
        let album = await Album.findById(albumId);
        if (!album) {
            throw new Error(`Album ${albumId} doesn't exist.`);
        }
        let photos = await Promise.all(photoIds.map(id => Photo.findOne({ _id: id, albumId })));
        let removePhotos = photos.map((photo: Model) => {
            if (photo) {
                photo.update({
                    albumId: null,
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
        let [album, photos] = await Promise.all([Album.findById(albumId), Photo.fetchList({ albumId })]);
        let photosMap = {};
        photos.forEach(photo => (photosMap[photo._id] = photo.attrs));
        return success({ photos, albumMetadata: album.attrs });
    } catch (err) {
        return error(err);
    }
};

export const updateAlbumMetadata = async (
    albumId: string,
    newMetadata: IAlbumMetadata
): Promise<ApiResponse<IAlbumMetadata>> => {
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

export const deleteAlbum = async (albumId: string, keepPhotos: boolean): Promise<ApiResponse<IAlbumMetadata>> => {
    try {
        let album = await Album.findById(albumId);
        await album.destroy();
        if (!keepPhotos) {
            let photos = await Photo.fetchList({ albumId });
            let photoIds = photos.map(photo => photo._id);
            await deletePhotos(photoIds);
        }
        return success(album.attrs);
    } catch (err) {
        return error(err);
    }
};
