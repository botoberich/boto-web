import React from 'react';

// UI
import { Icon, Menu, Dropdown, Typography, Modal } from 'antd';
import AlbumAdd from './AlbumAdd';
import styles from './AlbumGrid.module.css';

// State
import { createAlbum, removeFromAlbum, getAlbums, getAlbumById, deleteAlbum } from '../../services/album.service';
import { getThumbnail } from '../../services/photo.service';

// Types
import { IGetAlbumsResult, IAlbumMetadata } from '../../interfaces/albums.interface';
import { IThumbnail } from '../../interfaces/photos.interface';
import { ApiResponse } from '../../interfaces/response.interface';

const { Title, Paragraph } = Typography;
const { confirm } = Modal;

function useFetchAlbums() {
    const [response, setAlbums] = React.useState<ApiResponse<IGetAlbumsResult>>(null);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        try {
            const fetchAlbums = async () => {
                let albums = await getAlbums();
                let albumById = await getAlbumById(Object.keys(albums.data)[4]);
                console.log({ albums, albumById });
                setAlbums(albums);
            };
            fetchAlbums();
        } catch (e) {
            console.error(e);
            setError(e);
        }
    }, []);

    return { response, error };
}

function useFetchAlbumCover(id) {
    const [response, setResponse] = React.useState<ApiResponse<IThumbnail>>(null);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        try {
            async function fetchAlbumCover(id) {
                let resp = await getThumbnail(id);
                console.log({ resp });
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
    const { response, error } = useFetchAlbums();

    if (!response) {
        return <div>Loading...</div>;
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
                            <AlbumMenu album={album}></AlbumMenu>
                            <AlbumCover coverId={album.coverId}></AlbumCover>
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

function AlbumMenu({ album }) {
    const handleDeleteAlbum = React.useCallback(id => {
        confirm({
            title: 'Do you want to delete this album?',
            content: 'Your existing photos will not be deleted.',
            onOk() {
                deleteAlbum(album._id, false);
            },
            onCancel() {},
        });
    }, []);

    return (
        <>
            <Dropdown
                overlay={
                    <Menu>
                        <Menu.Item key="0" onClick={() => handleDeleteAlbum(album._id)}>
                            Delete
                        </Menu.Item>
                    </Menu>
                }
                trigger={['click']}>
                <div className={styles.moreButton} onClick={() => console.log('heyo')} role="button">
                    <Icon type="more" />
                </div>
            </Dropdown>
        </>
    );
}

export default AlbumGrid;
