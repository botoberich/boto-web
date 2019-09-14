import React from 'react';
import { Link, navigate } from 'gatsby';
import { Match } from '@reach/router';
import { isMobileOnly, isMobile } from 'react-device-detect';

// State
import { useDispatch } from 'react-redux';
import { Layout, Avatar, Menu, Dropdown, Tag, Icon } from 'antd';
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
import SetAlbumCover from './SetAlbumCover';
import CreateAlbum from './CreateAlbum';
import headerStyles from './Header.module.css';
import rootStyles from '../../app.module.css';

// Types
import { IMatchProps } from '../../interfaces/ui.interface';
import { useServiceContext } from '../../contexts/ServiceContext';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useHeaderContext } from '../../contexts/HeaderContext';
import AddToOneAlbum from './AddToOneAlbum';

const { Header } = Layout;
const styles = { ...headerStyles, ...rootStyles };

function HeaderInfo({ title, subtitle }) {
    return (
        <div className={styles.headerInfo}>
            <span className={styles.title}>{title}</span>
            <span className={styles.subtitle}>{subtitle}</span>
        </div>
    );
}

const btnVariants: Variants = {
    show: {
        transform: 'translateY(0px)',
    },
    hide: {
        transform: 'translateY(-50px)',
    },
};

function PageHeader() {
    const { selectedThumbnails, setSelectedThumbnails, setLoadingThumbnails } = useSelectonContext();
    const { useServer } = useServiceContext();
    const { progressDispatch } = useProgressContext();
    const { title, subtitle } = useHeaderContext();
    const dispatch = useDispatch();
    const noSelection = React.useMemo(() => selectedThumbnails.length === 0, [selectedThumbnails]);

    return (
        <Header className={styles.header}>
            <HeaderInfo title={title} subtitle={subtitle}></HeaderInfo>
            <nav className={styles.nav}>
                <Match path="/app">
                    {props =>
                        props.match && (
                            <AnimatePresence key="navbar">
                                <motion.div
                                    key={0}
                                    animate={noSelection ? 'show' : 'hide'}
                                    variants={btnVariants}
                                    style={{ margin: 0, position: 'absolute' }}>
                                    <Upload
                                        addPhoto={photo => dispatch(newPhoto(photo))}
                                        progressDispatch={progressDispatch}
                                        useServer={useServer}></Upload>
                                </motion.div>

                                {isMobileOnly && (
                                    <motion.div
                                        animate={!noSelection ? 'show' : 'hide'}
                                        className={styles.nav}
                                        initial={{ transform: 'translateY(-50px)' }}
                                        key={3}
                                        variants={btnVariants}>
                                        <Dropdown
                                            overlay={
                                                <Menu>
                                                    <Menu.Item key="tag">
                                                        <Tag className={styles.tag} color="#f50">
                                                            {selectedThumbnails.length}
                                                            <span className={styles.hideMobiles}>&nbsp;selected</span>
                                                        </Tag>
                                                    </Menu.Item>
                                                    <Menu.Item key="addalbum">
                                                        <AddToAlbum
                                                            className={styles.mobileButton}
                                                            selectedThumbnails={selectedThumbnails}
                                                            setSelectedThumbnails={setSelectedThumbnails}></AddToAlbum>
                                                    </Menu.Item>
                                                    <Menu.Item key="download">
                                                        <Download
                                                            className={styles.mobileButton}
                                                            useServer={useServer}
                                                            selectedThumbnails={selectedThumbnails}
                                                            setSelectedThumbnails={setSelectedThumbnails}
                                                        />
                                                    </Menu.Item>
                                                    <Menu.Item key="delete">
                                                        <Delete
                                                            progressDispatch={progressDispatch}
                                                            selectedThumbnails={selectedThumbnails}
                                                            setSelectedThumbnails={setSelectedThumbnails}
                                                            setLoadingThumbnails={setLoadingThumbnails}
                                                            removePhoto={metaData => dispatch(removePhoto(metaData))}
                                                            useServer={useServer}></Delete>
                                                    </Menu.Item>
                                                </Menu>
                                            }
                                            trigger={['click']}>
                                            <div className={styles.moreButton} role="button">
                                                <Icon type="more" />
                                            </div>
                                        </Dropdown>
                                    </motion.div>
                                )}

                                {!isMobileOnly && (
                                    <motion.nav
                                        key={1}
                                        className={styles.nav}
                                        initial={{ transform: 'translateY(-50px)' }}
                                        animate={!noSelection ? 'show' : 'hide'}
                                        variants={btnVariants}>
                                        <div className={styles.headerBtn}>
                                            <Tag className={styles.tag} color="#f50">
                                                {selectedThumbnails.length}
                                                <span>&nbsp;selected</span>
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
                                )}
                            </AnimatePresence>
                        )
                    }
                </Match>

                <Match path="/app/albums/:param/*">
                    {(props: IMatchProps) => {
                        if (props.match) {
                            switch (props.match.param) {
                                case 'new':
                                    if (isMobileOnly) {
                                        return (
                                            <motion.div animate={'show'} initial={{ transform: 'translateY(-50px)' }} key={3} variants={btnVariants}>
                                                <Dropdown
                                                    overlay={
                                                        <Menu>
                                                            <Menu.Item key="edit">
                                                                <CreateAlbum
                                                                    className={styles.mobileButton}
                                                                    selectedThumbnails={selectedThumbnails}
                                                                />
                                                            </Menu.Item>
                                                        </Menu>
                                                    }
                                                    trigger={['click']}>
                                                    <div className={styles.moreButton} role="button">
                                                        <Icon type="more" />
                                                    </div>
                                                </Dropdown>
                                            </motion.div>
                                        );
                                    } else {
                                        return (
                                            <motion.nav
                                                animate={'show'}
                                                className={styles.nav}
                                                initial={{ transform: 'translateY(-50px)' }}
                                                key={3}
                                                variants={btnVariants}>
                                                <div className={styles.headerBtn}>
                                                    <CreateAlbum selectedThumbnails={selectedThumbnails} />
                                                </div>
                                            </motion.nav>
                                        );
                                    }

                                case 'add':
                                    let albumId = props.match['*'];
                                    if (isMobileOnly) {
                                        return (
                                            <motion.div
                                                animate={!noSelection ? 'show' : 'hide'}
                                                initial={{ transform: 'translateY(-50px)' }}
                                                key={3}
                                                variants={btnVariants}>
                                                <Dropdown
                                                    overlay={
                                                        <Menu>
                                                            <Menu.Item key="add">
                                                                <Tag className={styles.tag} color="#f50">
                                                                    {selectedThumbnails.length}
                                                                    <span className={styles.hideMobiles}>&nbsp;selected</span>
                                                                </Tag>
                                                            </Menu.Item>
                                                            <Menu.Item key="edit">
                                                                <AddToOneAlbum
                                                                    className={styles.mobileButton}
                                                                    selectedThumbnails={selectedThumbnails}
                                                                    setSelectedThumbnails={setSelectedThumbnails}
                                                                    albumId={albumId}
                                                                />
                                                            </Menu.Item>
                                                        </Menu>
                                                    }
                                                    trigger={['click']}>
                                                    <div className={styles.moreButton} role="button">
                                                        <Icon type="more" />
                                                    </div>
                                                </Dropdown>
                                            </motion.div>
                                        );
                                    } else {
                                        return (
                                            <motion.nav
                                                animate={!noSelection ? 'show' : 'hide'}
                                                className={styles.nav}
                                                initial={{ transform: 'translateY(-50px)' }}
                                                key={3}
                                                variants={btnVariants}>
                                                <div className={styles.headerBtn}>
                                                    <AddToOneAlbum
                                                        className={styles.mobileButton}
                                                        selectedThumbnails={selectedThumbnails}
                                                        setSelectedThumbnails={setSelectedThumbnails}
                                                        albumId={albumId}
                                                    />
                                                </div>
                                            </motion.nav>
                                        );
                                    }
                                default:
                                    if (isMobileOnly) {
                                        return (
                                            <motion.div
                                                animate={!noSelection ? 'show' : 'hide'}
                                                initial={{ transform: 'translateY(-50px)' }}
                                                key={3}
                                                variants={btnVariants}>
                                                <Dropdown
                                                    overlay={
                                                        <Menu>
                                                            <Menu.Item key="add">
                                                                <Tag className={styles.tag} color="#f50">
                                                                    {selectedThumbnails.length}
                                                                    <span className={styles.hideMobiles}>&nbsp;selected</span>
                                                                </Tag>
                                                            </Menu.Item>
                                                            <Menu.Item key="edit">
                                                                <RemoveFromAlbum
                                                                    className={styles.mobileButton}
                                                                    albumId={props.match.param}
                                                                    selectedThumbnails={selectedThumbnails}
                                                                    setSelectedThumbnails={setSelectedThumbnails}
                                                                    setLoadingThumbnails={setLoadingThumbnails}
                                                                />
                                                            </Menu.Item>
                                                            <Menu.Item key="add">
                                                                <SetAlbumCover
                                                                    className={styles.mobileButton}
                                                                    albumId={props.match.param}
                                                                    selectedThumbnails={selectedThumbnails}
                                                                    setSelectedThumbnails={setSelectedThumbnails}></SetAlbumCover>
                                                            </Menu.Item>
                                                        </Menu>
                                                    }
                                                    trigger={['click']}>
                                                    <div className={styles.moreButton} role="button">
                                                        <Icon type="more" />
                                                    </div>
                                                </Dropdown>
                                            </motion.div>
                                        );
                                    } else {
                                        return (
                                            <motion.nav
                                                animate={!noSelection ? 'show' : 'hide'}
                                                className={styles.nav}
                                                initial={{ transform: 'translateY(-50px)' }}
                                                key={2}
                                                variants={btnVariants}>
                                                <div className={styles.headerBtn}>
                                                    <Tag className={styles.tag} color="#f50">
                                                        {selectedThumbnails.length}
                                                        <span>&nbsp;selected</span>
                                                    </Tag>
                                                </div>
                                                <div className={styles.headerBtn}>
                                                    <RemoveFromAlbum
                                                        albumId={props.match.param}
                                                        selectedThumbnails={selectedThumbnails}
                                                        setSelectedThumbnails={setSelectedThumbnails}
                                                        setLoadingThumbnails={setLoadingThumbnails}
                                                    />
                                                </div>
                                                <div className={styles.headerBtn}>
                                                    <SetAlbumCover
                                                        albumId={props.match.param}
                                                        selectedThumbnails={selectedThumbnails}
                                                        setSelectedThumbnails={setSelectedThumbnails}></SetAlbumCover>
                                                </div>
                                            </motion.nav>
                                        );
                                    }
                            }
                        }
                    }}
                </Match>
            </nav>

            <div className={`${styles.navItem} ${styles.userAvatar}`} style={{ marginLeft: '25px' }}>
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
