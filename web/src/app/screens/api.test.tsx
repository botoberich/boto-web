import React, { useCallback, useState, useEffect } from 'react';

// UI
import PhotoGrid from '../components/PhotoGrid';
import UploadOverlay from '../components/uploadOverlay';
import 'react-image-lightbox/style.css';
import { usePhotoContext } from '../contexts/PhotoContext';
import { Button, Input } from 'antd';
import { createAlbum, removeFromAlbum, getAlbums, getAlbumById } from '../services/album.service';
import { getThumbnailsByIds } from '../services/photo.service';
import { gaiaGet } from '../services/http.service';

function ApiTestScreen() {
    let { selectedThumbnails } = usePhotoContext();
    let [albumId, setAlbumId] = useState('');

    useEffect(() => {
        const fetchAlbums = async () => {
            let albums = await getAlbums();
            let albumById = await getAlbumById(Object.keys(albums.data)[4]);
            console.log({ albums, albumById });
        };

        const getThumbnail = async () => {
            let tn = await gaiaGet({ path: `user/photos/d6f060b1-a050-481a-8807-d3de0157dc25/thumbnail` });
            console.log({ tn });
        };
        // fetchAlbums();
        getThumbnail();
    }, []);

    const handleCreateAlbum = useCallback(async () => {
        let createRes = await createAlbum(selectedThumbnails, {
            title: 'Test Album',
            description: 'Test description for test album',
            coverId: '1111',
        });
        if (createRes.status === 'success') {
            createRes.data.$photos.subscribe({
                next: addRes => {
                    console.log(`photo added: `, addRes);
                },
                error: err => {
                    console.log(`photo add err`, err);
                },
            });
        } else {
            console.log(createRes.data);
        }
    }, [selectedThumbnails]);

    const handleRemove = useCallback(async () => {
        let removeRes = await removeFromAlbum(selectedThumbnails, albumId);
        if (removeRes.status === 'error') {
            removeRes.data.$photos.subscribe({
                next: res => {
                    console.log(`photo removed: `, res);
                },
                error: err => {
                    console.log(`photo removed err`, err);
                },
            });
        } else {
            console.log(removeRes.data);
        }
    }, [selectedThumbnails, albumId]);

    return (
        <>
            <Button onClick={handleCreateAlbum} style={{ marginBottom: '20px' }}>
                Create Album
            </Button>

            <Button onClick={handleRemove} style={{ marginBottom: '20px' }}>
                Remove from Album
            </Button>

            <Input onChange={e => setAlbumId(e.target.value)}></Input>
            {/* <PhotoGrid /> */}
        </>
    );
}

export default ApiTestScreen;
