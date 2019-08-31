import React from 'react';

// UI
import { Modal } from 'antd';

// State
import { updateAlbumMetadata } from '../../services/album.service';
import { getThumbnailsByIds } from '../../services/photo.service';
import AlbumForm, { useAlbumForm } from './AlbumForm';

// Types
import { IThumbnail, IPhotoMetadata } from '../../interfaces/photos.interface';
import { IAlbumMetadata } from '../../interfaces/albums.interface';

export const handleFetchAlbumThumbnails = async ({
    thumbnailIDs = [],
    onNext = (thumbnail: IThumbnail) => {},
    onComplete = () => {},
    onError = err => {},
    onEnd = () => {},
    onStart = (allMetadata: IPhotoMetadata[]) => {},
} = {}) => {
    let subscription = { unsubscribe: () => {} };

    const thumbnailsRes = await getThumbnailsByIds(thumbnailIDs);
    console.log({ thumbnailsRes });
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

export function useEditAlbumModal(album: IAlbumMetadata, { onSuccess = () => {} }) {
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

        let resp = await updateAlbumMetadata(album._id, {
            title: title,
            description: desc,
        });

        console.log('edit album response:', resp);
        if (resp !== undefined && resp.status === 'success') {
            onSuccess();
        }

        setConfirmLoading(false);
        setVisible(false);
    }, [title, desc, onSuccess, album._id]);

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

function EditModal({
    album,
    handleEditAlbum,
    visible,
    setVisible,
    confirmLoading,
    validInput,
    setValidInput,
    title,
    setTitle,
    desc,
    setDesc,
}) {
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
