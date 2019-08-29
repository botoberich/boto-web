import React from 'react';
import { navigate, Link } from 'gatsby';

// UI
import { Icon, Menu, Dropdown, Typography, Modal } from 'antd';
import AlbumAdd from './AlbumAdd';
import styles from './AlbumGrid.module.css';

// State
import { createAlbum, removeFromAlbum, getAlbums, getAlbumById, deleteAlbum } from '../../services/album.service';
import { getThumbnail } from '../../services/photo.service';
import { useEditAlbumModal } from './albums.hooks';

// Types
import { IGetAlbumsResult, IAlbumMetadata } from '../../interfaces/albums.interface';
import { IThumbnail } from '../../interfaces/photos.interface';
import { ApiResponse } from '../../interfaces/response.interface';

const { Title, Paragraph } = Typography;
const { confirm } = Modal;

function useFetchAlbums() {
    const [response, setResponse] = React.useState<ApiResponse<IGetAlbumsResult>>(null);
    const [error, setError] = React.useState(null);

    async function fetch() {
        try {
            const fetchAlbums = async () => {
                let albums = await getAlbums();
                setResponse(albums);
            };
            fetchAlbums();
        } catch (e) {
            console.error(e);
            setError(e);
        }
    }

    React.useEffect(() => {
        fetch();
    }, []);

    return { response, error, refetchAlbums: fetch };
}

function useFetchAlbumCover(id) {
    const [response, setResponse] = React.useState<ApiResponse<IThumbnail>>(null);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        try {
            async function fetchAlbumCover(id) {
                let resp = await getThumbnail(id);
                setResponse(resp);
            }
            fetchAlbumCover(id);
        } catch (e) {
            console.error(e);
            setError(e);
        }
    }, [id]);

    return { response, error };
}

function AlbumGrid() {
    // TODO: Figure out how to append a new album without refetching a whole list of albums again
    // But for now, refetch is fine

    const { response, refetchAlbums } = useFetchAlbums();

    if (!response) {
        return null;
    }

    if (response.status === 'success') {
        return (
            <div className={styles.grid}>
                <div className={styles.gridItem}>
                    <AlbumAdd></AlbumAdd>
                </div>
                {Object.values(response.data).map((album: IAlbumMetadata, i) => {
                    return (
                        <Link to={`/app/albums/${album._id}`} key={album._id}>
                            <div className={styles.gridItem}>
                                <div className={styles.topOverlay}></div>
                                <AlbumMenu album={album} refetchAlbums={refetchAlbums}></AlbumMenu>
                                <AlbumCover coverId={album.coverId}></AlbumCover>
                                <AlbumHeader description={album.description} title={album.title}></AlbumHeader>
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    }

    return null;
}

function AlbumCover({ coverId }) {
    const { response, error } = useFetchAlbumCover(coverId);

    if (!response) {
        return <div className={styles.albumCover}></div>;
    }

    if (response.status === 'success') {
        return (
            <div
                className={styles.albumCover}
                style={{
                    background:
                        response.data.b64 !== undefined ? `url("data:image/png;base64,${response.data.b64}")` : '',
                }}></div>
        );
    }

    return null;
}

function AlbumHeader({ title, description }) {
    return (
        <div className={styles.albumHeader}>
            <Title level={4} className={styles.title}>
                {title}
            </Title>
            <Paragraph className={styles.description}>{description}</Paragraph>
        </div>
    );
}

function AlbumMenu({ album, refetchAlbums }: { album: IAlbumMetadata; refetchAlbums: () => void }) {
    const { Modal, setVisible } = useEditAlbumModal(album, { onSuccess: refetchAlbums });

    const handleModalOpen = React.useCallback(() => setVisible(true), [setVisible]);

    const handleDeleteAlbum = React.useCallback(
        id => {
            confirm({
                title: 'Do you want to delete this album?',
                content: 'Your existing photos will not be deleted.',
                onOk() {
                    deleteAlbum(album._id, false);
                },
                onCancel() {},
            });
        },
        [album._id]
    );

    return (
        <>
            <Dropdown
                overlay={
                    <Menu>
                        <Menu.Item key="add" onClick={() => navigate(`/app/albums/${album._id}`)}>
                            Add Photos
                        </Menu.Item>
                        <Menu.Item key="edit" onClick={handleModalOpen}>
                            Edit
                        </Menu.Item>
                        <Menu.Item key="delete" onClick={() => handleDeleteAlbum(album._id)}>
                            Delete
                        </Menu.Item>
                    </Menu>
                }
                trigger={['click']}>
                <div className={styles.moreButton} role="button">
                    <Icon type="more" />
                </div>
            </Dropdown>

            {Modal}
        </>
    );
}

export default AlbumGrid;
