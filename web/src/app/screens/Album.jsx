import React from 'react';
import AlbumGrid from '../components/Album/AlbumGrid';
import { useHeaderContext } from '../contexts/HeaderContext';

function AlbumScreen() {
    const { setTitle } = useHeaderContext();
    setTitle('Albums');
    return <AlbumGrid></AlbumGrid>;
}

export default AlbumScreen;
