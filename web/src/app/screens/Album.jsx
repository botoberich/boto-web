import React from 'react';
import AlbumGrid from '../components/Album/AlbumGrid';
import { useHeaderContext } from '../contexts/HeaderContext';

function AlbumScreen() {
    const { setHeaderTitle } = useHeaderContext();
    setHeaderTitle('Albums');
    return <AlbumGrid></AlbumGrid>;
}

export default AlbumScreen;
