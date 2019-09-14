import React from 'react';
import { navigate } from 'gatsby';

// State
import { createAlbum } from '../../services/album.service';
import { useFormContext } from '../../contexts/FormContext';

// UI
import { Button, Icon } from 'antd';
import styles from './CreateAlbum.module.css';

// Types
import { notifyError } from '../../utils/notification';
import { IAlbumMetadata } from '../../interfaces/albums.interface';

function CreateAlbum({ selectedThumbnails }) {
    const {
        albumForm: { title, description },
        setAlbumForm,
    } = useFormContext();
    const [creating, setCreating] = React.useState(false);

    React.useEffect(() => {
        return () => {
            setAlbumForm({ title: '', description: '' });
        };
    }, []);

    const handleCreateNewAlbum = React.useCallback(async () => {
        if (title.length === 0) {
            return;
        }

        const albumMetaData: IAlbumMetadata = {
            title,
            description,
            coverId: selectedThumbnails[0],
        };

        setCreating(true);
        try {
            const resp = await createAlbum(selectedThumbnails, albumMetaData);
            if (resp.status === 'success') {
                const albumId = resp.data.albumMetadata._id;
                setTimeout(() => {
                    setCreating(false);
                    navigate(`/app/albums/${albumId}`);
                }, 1000);
            }
        } catch (err) {
            notifyError('Unable to create album. Please contact support.');
        }
    }, [selectedThumbnails, title, description]);

    return (
        <Button disabled={title.length === 0 || creating} onClick={handleCreateNewAlbum}>
            {!creating && (
                <>
                    <Icon type="wallet" theme="twoTone" /> <span className={styles.hideMobile}>Create Album</span>
                </>
            )}
            {creating && (
                <>
                    <Icon type="loading" /> <span className={styles.hideMobile}>Creating</span>
                </>
            )}
        </Button>
    );
}

export default CreateAlbum;
