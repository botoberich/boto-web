import React from 'react';

// UI
import AlbumView, { useAlbumView } from '../components/Album/AlbumView';
import { useHeaderContext } from '../contexts/HeaderContext';
import PhotoGrid, { usePhotoGrid } from '../components/Photo/PhotoGrid';
import { useSelector } from 'react-redux';
import { skeletonSelector } from '../redux/photo/photo.selectors';
import { albumSelector } from '../redux/album/album.selectors';

function AddToAlbumScreen({ albumID }) {
    const meta = useSelector(state => albumSelector(state, albumID));
    const title =
        (meta && meta.title) ||
        (meta && meta.albumMetadata.title) ||
        ''; /** not sure why it comes in differently depending on where you navigating from */
    const { setHeaderTitle } = useHeaderContext();
    setHeaderTitle(`Add Photos | ${title}`);

    const { loading } = usePhotoGrid();
    const skeleton = useSelector(state => skeletonSelector(state));
    return <PhotoGrid loading={loading} skeleton={skeleton} parent="album/add" />;
}

export default AddToAlbumScreen;
