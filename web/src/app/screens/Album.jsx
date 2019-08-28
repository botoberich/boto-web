import React from 'react';
import { AlbumProvider } from '../contexts/AlbumContext';
import AlbumGrid from '../components/AlbumGrid';

function AlbumScreen() {
    return (
        <AlbumProvider>
            <AlbumGrid></AlbumGrid>
        </AlbumProvider>
    );
}

export default AlbumScreen;
