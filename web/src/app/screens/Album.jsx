import React from 'react';
import { AlbumProvider } from '../contexts/AlbumContext';

function Album() {
    return (
        <AlbumProvider>
            <h1>Album page</h1>
        </AlbumProvider>
    );
}

export default Album;
