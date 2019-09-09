import React from 'react';

// UI
import AlbumView, { useAlbumView } from '../components/Album/AlbumView';

function DetailedAlbumScreen({ albumID }) {
    const { title, loading, skeleton } = useAlbumView({ albumID });
    return <AlbumView title={title} skeleton={skeleton} loading={loading}></AlbumView>;
}

export default DetailedAlbumScreen;
