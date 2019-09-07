import React from 'react';

// UI
import { Modal } from 'antd';

// State
import { updateAlbumMetadata, removeFromAlbum, addToAlbum, getAlbums } from '../../services/album.service';
import { getThumbnailsByIds } from '../../services/photo.service';
import AlbumForm, { useAlbumForm } from './AlbumForm';

// Types
import { IThumbnail, IPhotoMetadata } from '../../interfaces/photos.interface';
import { IAlbumMetadata } from '../../interfaces/albums.interface';

export const handleRemoveFromAlbum = ({ albumId, photoIds }) => {
    return removeFromAlbum(photoIds, albumId);
};

export const handleAddToAlbum = async ({ albumId, photoIds }) => {
    return addToAlbum(photoIds, albumId);
};

export const handleFetchAlbumThumbnails = async (
    useServer: boolean = false,
    {
        thumbnailIDs = [],
        onNext = (thumbnail: IThumbnail) => {},
        onComplete = () => {},
        onError = err => {},
        onEnd = () => {},
        onStart = (allMetadata: IPhotoMetadata[]) => {},
    } = {}
) => {
    let subscription = { unsubscribe: () => {} };

    const thumbnailsRes = await getThumbnailsByIds(useServer, thumbnailIDs);
    if (thumbnailsRes.status !== 'success') {
        return;
    }

    onStart(thumbnailsRes.data.allMetadata);
    if (thumbnailsRes.status === 'success') {
        subscription = thumbnailsRes.data.$thumbnails.subscribe({
            next: res => {
                onNext(res);
            },
            error: err => {
                onError(err);
                onEnd();
            },
            complete: () => {
                onComplete();
                onEnd();
            },
        });
    } else {
        console.log('Error: ', thumbnailsRes.data);
        onError(thumbnailsRes.data);
        onEnd();
    }

    return subscription;
};

export function useEditAlbumModal(album: IAlbumMetadata, { refetchAlbums = () => {} }) {
    const { title, setTitle, desc, setDesc, validInput, setValidInput } = useAlbumForm({
        initialTitle: album.title,
        initialDesc: album.description,
    });
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const handleEditAlbum = React.useCallback(async () => {
        if (title.length === 0) {
            setValidInput(false);
            return;
        }

        setConfirmLoading(true);

        await updateAlbumMetadata(album._id, {
            title: title,
            description: desc,
        });

        refetchAlbums();
        setConfirmLoading(false);
        setVisible(false);
    }, [title, desc, album._id]);

    return {
        Modal: (
            <EditModal
                album={album}
                handleEditAlbum={handleEditAlbum}
                visible={visible}
                setVisible={setVisible}
                confirmLoading={confirmLoading}
                validInput={validInput}
                setValidInput={setValidInput}
                title={title}
                setTitle={setTitle}
                desc={desc}
                setDesc={setDesc}></EditModal>
        ),
        visible,
        setVisible,
        confirmLoading,
        setConfirmLoading,
        validInput,
        setValidInput,
        title,
        setTitle,
        desc,
        setDesc,
    };
}

function EditModal({ album, handleEditAlbum, visible, setVisible, confirmLoading, validInput, setValidInput, title, setTitle, desc, setDesc }) {
    return (
        <Modal
            title={`Editing album ${album.title}`}
            visible={visible}
            onOk={handleEditAlbum}
            onCancel={() => setVisible(false)}
            confirmLoading={confirmLoading}>
            <AlbumForm
                setTitle={setTitle}
                title={title}
                setDesc={setDesc}
                desc={desc}
                setValidInput={setValidInput}
                validInput={validInput}></AlbumForm>
        </Modal>
    );
}
