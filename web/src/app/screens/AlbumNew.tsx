import React from 'react';
import AlbumCreate from '../components/Album/AlbumCreate';
import { useHeaderContext } from '../contexts/HeaderContext';

function NewAlbumScreen() {
    const { setTitle, setSubtitle } = useHeaderContext();
    setTitle(`Create Album`);
    setSubtitle(`Select photos to add`);
    return <AlbumCreate></AlbumCreate>;
}

export default NewAlbumScreen;
