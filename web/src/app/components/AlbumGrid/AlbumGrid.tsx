import React from 'react';

// UI
import { Icon, Menu, Dropdown, Typography } from 'antd';
import styles from './AlbumGrid.module.css';

// State
import { createAlbum, removeFromAlbum, getAlbums, getAlbumById } from '../../services/album.service';
import { getThumbnail } from '../../services/photo.service';

// Types
import { IGetAlbumsResult, IAlbumMetadata } from '../../interfaces/albums.interface';
import { ApiResponse } from '../../interfaces/response.interface';

const { Title, Paragraph } = Typography;
const menu = (
    <Menu>
        <Menu.Item key="0">Delete</Menu.Item>
    </Menu>
);

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
    // const [response, setAlbums] = React.useState<ApiResponse<IGetAlbumsResult>>(null);
    // const [error, setError] = React.useState(null);
    React.useEffect(() => {
        getThumbnail(id);
        // try {
        //     async function fetchAlbumCover(id) {
        //         let albums = await getAlbums();
        //         let albumById = await getAlbumById(Object.keys(albums.data)[4]);
        //         console.log({ albums: albums.data.albums, albumById });
        //         setAlbums(albums);
        //     };
        //     fetchAlbumCover(id);
        // } catch (e) {
        //     console.error(e);
        //     setError(e);
        // }
    }, []);

    // return { response, error };
}

function AlbumGrid() {
    const { response, error } = useFetchAlbums();
    if (!response) {
        return <div>Loading...</div>;
    }

    if (response.status === 'success') {
        return (
            <div className={styles.grid}>
                {Object.values(response.data).map((album: IAlbumMetadata, i) => {
                    return (
                        <div className={styles.gridItem} key={album._id}>
                            <div className={styles.topOverlay}></div>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <div className={styles.moreButton} onClick={() => console.log('heyo')} role="button">
                                    <Icon type="more" />
                                </div>
                            </Dropdown>
                            <AlbumCover coverId={album.coverId}></AlbumCover>
                            <AlbumHeader description={album.description} title={album.title}></AlbumHeader>
                        </div>
                    );
                })}
            </div>
        );
    }
}

function AlbumCover({ coverId }) {
    useFetchAlbumCover(coverId);
    return (
        <div
            className={styles.albumCover}
            style={{
                backgroundImage: `url("https://via.placeholder.com/235")`,
            }}></div>
    );
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

export default AlbumGrid;
