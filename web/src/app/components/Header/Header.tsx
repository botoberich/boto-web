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

const { Header } = Layout;

function PageHeader() {
    const { selectedThumbnails, setSelectedThumbnails, setLoadingThumbnails } = useSelectonContext();
    const { useServer } = useServiceContext();
    const { progressDispatch } = useProgressContext();
    const dispatch = useDispatch();

    const btnShowHide = React.useMemo(
        () => (selectedThumbnails.length > 0 ? `${styles.headerBtn} ${styles.headerBtnShown}` : `${styles.headerBtn} ${styles.headerBtnHidden}`),
        [selectedThumbnails]
    );

    const btnShowHideReverse = React.useMemo(
        () => (selectedThumbnails.length === 0 ? `${styles.headerBtn} ${styles.headerBtnShown}` : `${styles.headerBtn} ${styles.headerBtnHidden}`),
        [selectedThumbnails]
    );

    return (
        <Header className={styles.header}>
            <Match path="/app/:title/*">
                {(props: IMatchProps) => <span className={styles.headerTitle}>{props.match ? props.match.title : 'photos'}</span>}
            </Match>
            <nav className={styles.nav}>
                <Match path="/app">
                    {props =>
                        props.match && (
                            <>
                                <div className={btnShowHide}>
                                    <Tag className={styles.tag} color="#f50">
                                        {selectedThumbnails.length}
                                        <span className={styles.hideMobile}>&nbsp;selected</span>
                                    </Tag>
                                </div>
                                <div className={btnShowHideReverse}>
                                    <Upload
                                        addPhoto={photo => dispatch(newPhoto(photo))}
                                        progressDispatch={progressDispatch}
                                        useServer={useServer}></Upload>
                                </div>
                                <>
                                    <div className={btnShowHide}>
                                        <AddToAlbum
                                            selectedThumbnails={selectedThumbnails}
                                            setSelectedThumbnails={setSelectedThumbnails}></AddToAlbum>
                                    </div>
                                    <div className={btnShowHide}>
                                        <Download
                                            useServer={useServer}
                                            selectedThumbnails={selectedThumbnails}
                                            setSelectedThumbnails={setSelectedThumbnails}
                                        />
                                    </div>
                                    <div className={btnShowHide}>
                                        <Delete
                                            progressDispatch={progressDispatch}
                                            selectedThumbnails={selectedThumbnails}
                                            setSelectedThumbnails={setSelectedThumbnails}
                                            setLoadingThumbnails={setLoadingThumbnails}
                                            removePhoto={metaData => dispatch(removePhoto(metaData))}
                                            useServer={useServer}></Delete>
                                    </div>
                                </>
                            </>
                        )
                    }
                </Match>

                <Match path="/app/albums/:id">
                    {(props: IMatchProps) =>
                        props.match && (
                            <div className={btnShowHide}>
                                <RemoveFromAlbum
                                    albumId={props.match.id}
                                    // thumbnails={thumbnails}
                                    // setThumbnails={setThumbnails}
                                    selectedThumbnails={selectedThumbnails}
                                    setSelectedThumbnails={setSelectedThumbnails}
                                />
                            </div>
                        )
                    }
                </Match>

                <div className={styles.navItem} style={{ marginLeft: '25px' }}>
                    <UserAvatar></UserAvatar>
                </div>
            </nav>
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
            <div>
                <Avatar className={styles.avatar} icon="user" />
                <span className={`${styles.hideMobile} ${styles.userName}`}>{userName}</span>
            </div>
        </Dropdown>
    );
}
