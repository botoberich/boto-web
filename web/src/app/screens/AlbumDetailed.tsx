import React from 'react';

// State
import { useSelector } from 'react-redux';
import { albumSkeletonSelector } from '../redux/album/album.selectors';

// UI
import AlbumView, { useAlbumView } from '../components/Album/AlbumView';

function DetailedAlbumScreen({ albumID }) {
    const { title, loading } = useAlbumView({ albumID });

    const skeleton = useSelector(state => albumSkeletonSelector(state, albumID));

    console.log({ skeleton });

    return <AlbumView title={title} skeleton={skeleton} loading={loading}></AlbumView>;
}

export default DetailedAlbumScreen;
