import React from 'react';

// UI
import AlbumView, { useAlbumView } from '../components/Album/AlbumView';
import { useHeaderContext } from '../contexts/HeaderContext';

function DetailedAlbumScreen({ albumID }) {
    const { title, loading, skeleton } = useAlbumView({ albumID });
    const { setHeaderTitle } = useHeaderContext();
    setHeaderTitle(`Album | ${title}`);
    return <AlbumView title={title} skeleton={skeleton} albumId={albumID} loading={loading}></AlbumView>;
}

export default DetailedAlbumScreen;
