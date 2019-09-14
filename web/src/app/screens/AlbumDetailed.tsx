import React from 'react';

// UI
import AlbumView, { useAlbumView } from '../components/Album/AlbumView';

function DetailedAlbumScreen({ albumID }) {
    const { loading, skeleton } = useAlbumView({ albumID });
    return <AlbumView skeleton={skeleton} albumId={albumID} loading={loading}></AlbumView>;
}

export default DetailedAlbumScreen;
