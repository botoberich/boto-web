import React from 'react';

// UI
import AlbumView, { useAlbumView } from '../components/Album/AlbumView';

function DetailedAlbumScreen({ albumID }) {
    const { title, thumbnails, loading } = useAlbumView({ albumID });

    return <AlbumView title={title} thumbnails={thumbnails} loading={loading}></AlbumView>;
}

export default DetailedAlbumScreen;
