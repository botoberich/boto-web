import React from 'react';
import { Link, navigate } from 'gatsby';
import { Match } from '@reach/router';

// State
import { useDispatch } from 'react-redux';
import { Layout, Avatar, Menu, Dropdown, Tag, Typography, Icon } from 'antd';
import { checkIsSignedIn, getUser, logout, handleLogin } from '../../services/auth.service';
import { useProgressContext } from '../../contexts/ProgressContext';
import { useSelectonContext } from '../../contexts/SelectionContext';
import { removePhoto, newPhoto } from '../../redux/photo/photo.actions';
import { removeAlbumPhotos } from '../../redux/album/album.actions';

// UI
import Upload from './Upload';
import Delete from './Delete';
import Download from './Download';
import RemoveFromAlbum from './RemoveFromAlbum';
import AddToAlbum from './AddToAlbum';
import styles from './Header.module.css';

// Types
import { IMatchProps } from '../../interfaces/ui.interface';
import { useServiceContext } from '../../contexts/ServiceContext';
import { AnimatePresence, motion, Variants } from 'framer-motion';

const { Header } = Layout;

function PageHeader() {
    const { selectedThumbnails, setSelectedThumbnails, setLoadingThumbnails } = useSelectonContext();
    const { useServer } = useServiceContext();
    const { progressDispatch } = useProgressContext();
    const dispatch = useDispatch();

    const noSelection = React.useMemo(() => selectedThumbnails.length === 0, [selectedThumbnails]);

    const variants: Variants = {
        show: {
            transform: 'translateY(0px)',
        },
        hide: {
            transform: 'translateY(-50px)',
        },
    };

    return (
        <Header className={styles.header}>
            <Match path="/app/:title/*">
                {(props: IMatchProps) => {
                    let title = props.match ? props.match.title : 'Photos';
                    if (props.match && props.match['*'] === 'new' && props.match.title === 'albums') {
                        title = 'Create Album';
                    }
                    return <span className={styles.headerTitle}>{title}</span>;
                }}
            </Match>
            <nav className={styles.nav}>
                <Match path="/app">
                    {props =>
                        props.match && (
                            <AnimatePresence>
                                <motion.div animate={noSelection ? 'show' : 'hide'} variants={variants} style={{ margin: 0, position: 'absolute' }}>
                                    <Upload
                                        addPhoto={photo => dispatch(newPhoto(photo))}
                                        progressDispatch={progressDispatch}
                                        useServer={useServer}></Upload>
                                </motion.div>

                                <motion.nav
                                    className={styles.nav}
                                    initial={{ transform: 'translateY(-50px)' }}
                                    animate={!noSelection ? 'show' : 'hide'}
                                    variants={variants}>
                                    <div className={styles.headerBtn}>
                                        <Tag className={styles.tag} color="#f50">
                                            {selectedThumbnails.length}
                                            <span className={styles.hideMobile}>&nbsp;selected</span>
                                        </Tag>
                                    </div>
                                    <div className={styles.headerBtn}>
                                        <AddToAlbum
                                            selectedThumbnails={selectedThumbnails}
                                            setSelectedThumbnails={setSelectedThumbnails}></AddToAlbum>
                                    </div>
                                    <div className={styles.headerBtn}>
                                        <Download
                                            useServer={useServer}
                                            selectedThumbnails={selectedThumbnails}
                                            setSelectedThumbnails={setSelectedThumbnails}
                                        />
                                    </div>
                                    <div className={styles.headerBtn}>
                                        <Delete
                                            progressDispatch={progressDispatch}
                                            selectedThumbnails={selectedThumbnails}
                                            setSelectedThumbnails={setSelectedThumbnails}
                                            setLoadingThumbnails={setLoadingThumbnails}
                                            removePhoto={metaData => dispatch(removePhoto(metaData))}
                                            useServer={useServer}></Delete>
                                    </div>
                                </motion.nav>
                            </AnimatePresence>
                        )
                    }
                </Match>

                <Match path="/app/albums/:param">
                    {(props: IMatchProps) =>
                        props.match &&
                        props.match.param !== 'new' && (
                            <motion.div
                                variants={variants}
                                initial={{ transform: 'translateY(-50px)' }}
                                animate={!noSelection ? 'show' : 'hide'}
                                className={styles.headerBtn}>
                                <RemoveFromAlbum
                                    albumId={props.match.param}
                                    removePhotosFromAlbum={() => dispatch(removeAlbumPhotos(props.match.param, selectedThumbnails))}
                                    selectedThumbnails={selectedThumbnails}
                                    setSelectedThumbnails={setSelectedThumbnails}
                                />
                            </motion.div>
                        )
                    }
                </Match>
            </nav>
            <div className={styles.navItem} style={{ marginLeft: '25px' }}>
                <UserAvatar></UserAvatar>
            </div>
        </Header>
    );
}

export default PageHeader;

function AuthButton() {
    const [signedIn, setSignedIn] = React.useState(false);
    React.useEffect(() => {
        async function signin() {
            try {
                checkIsSignedIn().then(signedIn => {
                    setSignedIn(signedIn);
                });
            } catch (e) {
                console.log('error signing in');
                console.error(e);
            }
        }

        signin();
    }, []);

    if (signedIn) {
        return (
            <Link
                to="/"
                onClick={async event => {
                    event.preventDefault();
                    logout(() => navigate(`/`));
                }}>
                Logout
            </Link>
        );
    }

    return (
        <Link
            to="/"
            onClick={async event => {
                handleLogin(() => {
                    navigate(`/app/`);
                });
            }}>
            Logout
        </Link>
    );
}

function UserAvatar() {
    const userData = getUser();
    const userName = userData.username !== undefined && userData.username.split('.')[0];

    return (
        <Dropdown
            overlay={
                <Menu>
                    <Menu.Item>
                        <AuthButton />
                    </Menu.Item>
                </Menu>
            }>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar className={styles.avatar} icon="user" />
                <span className={`${styles.hideMobile} ${styles.userName}`}>{userName}</span>
            </div>
        </Dropdown>
    );
}
