import React from 'react';
import AlbumGrid from '../components/Album/AlbumGrid';
import { useHeaderContext } from '../contexts/HeaderContext';

function AlbumScreen() {
    const { setHeaderTitle } = useHeaderContext();
    setHeaderTitle('Album');
    return <AlbumGrid></AlbumGrid>;
}

export default AlbumScreen;
