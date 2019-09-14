import React from 'react';
import AlbumCreate from '../components/Album/AlbumCreate';
import { useHeaderContext } from '../contexts/HeaderContext';

function NewAlbumScreen() {
    const { setHeaderTitle } = useHeaderContext();
    setHeaderTitle(`Create Album`);
    return <AlbumCreate></AlbumCreate>;
}

export default NewAlbumScreen;
