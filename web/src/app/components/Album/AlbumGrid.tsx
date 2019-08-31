import React from 'react';
import { navigate, Link } from 'gatsby';

// UI
import { Icon, Menu, Dropdown, Typography, Modal } from 'antd';
import AlbumAdd from './AlbumAdd';
import styles from './AlbumGrid.module.css';

// State
import { getAlbums, deleteAlbum } from '../../services/album.service';
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
        const fetchAlbums = async () => {
            let albums = await getAlbums();
            setResponse(albums);
        };

        try {
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
    if (!id) {
        return {};
    }

    const [cover, setCover] = React.useState<IThumbnail>(null);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        async function fetchAlbumCover(id) {
            const resp = await getThumbnail(id);
            if (resp && resp.status === 'success') {
                setCover(resp.data);
            }
        }

        try {
            fetchAlbumCover(id);
        } catch (e) {
            console.error(e);
            setError(e);
        }
    }, [id]);

    return { cover, error };
}

function AlbumGrid() {
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
                        <div className={styles.gridItem} key={album._id}>
                            <div className={styles.topOverlay}></div>
                            <AlbumMenu album={album} refetchAlbums={refetchAlbums}></AlbumMenu>
                            <Link to={`/app/albums/${album._id}`} key={album._id}>
                                <AlbumCover coverId={album.coverId}></AlbumCover>
                            </Link>
                            <AlbumHeader description={album.description} title={album.title}></AlbumHeader>
                        </div>
                    );
                })}
            </div>
        );
    }

    return null;
}

function AlbumCover({ coverId }) {
    const { cover } = useFetchAlbumCover(coverId);

    if (!cover) {
        return <div className={styles.albumCover}></div>;
    }

    return (
        <div
            aria-label="Album Cover"
            className={styles.albumCover}
            style={{
                backgroundImage: `url("data:image/png;base64,${cover.b64}"`,
            }}></div>
    );

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
    const { Modal, setVisible } = useEditAlbumModal(album);

    const handleModalOpen = React.useCallback(e => setVisible(true), [setVisible]);

    const handleDeleteAlbum = React.useCallback(
        id => {
            confirm({
                title: 'Do you want to delete this album?',
                content: 'Your existing photos will not be deleted.',
                async onOk() {
                    const resp = await deleteAlbum(album._id, false);
                    if (resp.status === 'success') {
                        refetchAlbums();
                    }
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
