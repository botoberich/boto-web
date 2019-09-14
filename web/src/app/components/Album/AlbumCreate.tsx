import React from 'react';
import { navigate } from 'gatsby';

// UI
import AlbumForm from './AlbumForm';
import PhotoGrid, { usePhotoGrid } from '../Photo/PhotoGrid';
import { Typography, Button, notification, Icon } from 'antd';
import styles from './AlbumCreate.module.css';

// State
import { useSelectonContext } from '../../contexts/SelectionContext';
import { createAlbum } from '../../services/album.service';
import { useSelector, useDispatch } from 'react-redux';
import { skeletonSelector } from '../../redux/photo/photo.selectors';

// Types
import { ArgsProps } from 'antd/lib/notification';
import { IAlbumMetadata } from '../../interfaces/albums.interface';
import { notifySuccess } from '../../utils/notification';

const { Title, Paragraph } = Typography;

function AlbumCreate() {
    const { loading } = usePhotoGrid();
    const skeleton = useSelector(state => skeletonSelector(state));

    const { selectedThumbnails, setSelectedThumbnails } = useSelectonContext();
    const [creating, setCreating] = React.useState(false);

    React.useEffect(() => {
        return () => {
            setSelectedThumbnails([]);
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
