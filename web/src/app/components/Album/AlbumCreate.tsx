import React from 'react';

// UI
import AlbumForm from './AlbumForm';
import PhotoGrid, { usePhotoGrid } from '../Photo/PhotoGrid';
import styles from './AlbumCreate.module.css';

// State
import { useSelectonContext } from '../../contexts/SelectionContext';
import { useSelector } from 'react-redux';
import { skeletonSelector } from '../../redux/photo/photo.selectors';
import { useFormContext } from '../../contexts/FormContext';

// Types

function AlbumCreate() {
    const { loading } = usePhotoGrid();
    const skeleton = useSelector(state => skeletonSelector(state));

    const { setSelectedThumbnails } = useSelectonContext();
    const { setAlbumForm, albumForm } = useFormContext();

    const resetForm = React.useCallback(() => {
        setAlbumForm({ description: '', title: '' });
    }, [albumForm]);

    React.useEffect(() => {
        resetForm();
        return () => {
            setSelectedThumbnails([]);
            resetForm();
        };
    }, []);

    return (
        <>
            <div className={styles.inputContainer}>
                <AlbumForm></AlbumForm>
            </div>
            <div className={styles.row}>
                <PhotoGrid skeleton={skeleton} loading={loading}></PhotoGrid>
            </div>
        </>
    );
}

export default AlbumCreate;
