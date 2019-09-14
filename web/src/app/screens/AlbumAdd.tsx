import React from 'react';

// UI
import { useHeaderContext } from '../contexts/HeaderContext';
import PhotoGrid, { usePhotoGrid } from '../components/Photo/PhotoGrid';
import { useSelector } from 'react-redux';
import { skeletonSelector } from '../redux/photo/photo.selectors';
import { albumSelector } from '../redux/album/album.selectors';

function AddToAlbumScreen({ albumID }) {
    const album = useSelector(state => albumSelector(state, albumID));
    const title = album ? album.title : '';
    const { setTitle, setSubtitle } = useHeaderContext();
    setTitle(`Add photos`);
    setSubtitle(title);

    React.useEffect(() => {
        return () => {
            setSubtitle('');
        };
    }, []);

    const { loading } = usePhotoGrid();
    const skeleton = useSelector(state => skeletonSelector(state));
    return <PhotoGrid loading={loading} skeleton={skeleton} parent="album/add" />;
}

export default AddToAlbumScreen;
