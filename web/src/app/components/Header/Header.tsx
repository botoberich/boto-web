import React from 'react';
import { Link, navigate } from 'gatsby';
import { Match } from '@reach/router';

// State
import { Layout, Avatar, Menu, Dropdown, Tag, Typography, Icon } from 'antd';
import { checkIsSignedIn, getUser, logout, handleLogin } from '../../services/auth.service';
import { useProgressContext } from '../../contexts/ProgressContext';
import { useSelectonContext } from '../../contexts/SelectionContext';

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
    const { selectedThumbnails, setSelectedThumbnails, setThumbnails, setloadingThumbnails, thumbnails } = useSelectonContext();

    const { useServer } = useServiceContext();
    const { progressDispatch } = useProgressContext();

    return (
        <Header className={styles.header}>
            <Match path="/app/:title/*">
                {(props: IMatchProps) => <span className={styles.headerTitle}>{props.match ? props.match.title : 'photos'}</span>}
            </Match>
            <nav className={styles.nav}>
                <div className={styles.navItem}>
                    {selectedThumbnails.length > 0 && (
                        <Tag className={styles.tag} color="#f50">
                            {selectedThumbnails.length}
                            <span className={styles.hideMobile}>&nbsp;selected</span>
                        </Tag>
                    )}
                </div>

                {/* Additive Actions */}
                <div className={styles.navItem}>
                    <Dropdown
                        trigger={['click']}
                        overlayClassName={styles.navDropdown}
                        overlay={
                            <Menu>
                                <Menu.Item>
                                    <Match path="/app/">
                                        {props =>
                                            props.match && (
                                                <div className={styles.navItem}>
                                                    <Upload
                                                        setThumbnails={setThumbnails}
                                                        progressDispatch={progressDispatch}
                                                        useServer={useServer}></Upload>
                                                </div>
                                            )
                                        }
                                    </Match>
                                </Menu.Item>
                                <Menu.Item>
                                    <Match path="/app">
                                        {props =>
                                            props.match && (
                                                <div className={styles.navItem}>
                                                    <AddToAlbum
                                                        selectedThumbnails={selectedThumbnails}
                                                        setSelectedThumbnails={setSelectedThumbnails}></AddToAlbum>
                                                </div>
                                            )
                                        }
                                    </Match>
                                </Menu.Item>
                            </Menu>
                        }>
                        <Icon type="plus-circle" theme="twoTone" twoToneColor="#1890ff" style={{ fontSize: '24px' }} />
                    </Dropdown>
                </div>

                {/* Deletion/Removal Actions */}
                <div className={styles.navItem}>
                    <Dropdown
                        trigger={['click']}
                        overlayClassName={styles.navDropdown}
                        overlay={
                            <Menu>
                                <Menu.Item>
                                    <Match path="/app/">
                                        {props =>
                                            props.match && (
                                                <div className={styles.navItem}>
                                                    <Delete
                                                        progressDispatch={progressDispatch}
                                                        selectedThumbnails={selectedThumbnails}
                                                        setSelectedThumbnails={setSelectedThumbnails}
                                                        setloadingThumbnails={setloadingThumbnails}
                                                        setThumbnails={setThumbnails}
                                                        useServer={useServer}></Delete>
                                                </div>
                                            )
                                        }
                                    </Match>
                                </Menu.Item>

                                <Match path="/app/albums/:id">
                                    {(props: IMatchProps) => {
                                        if (!props.match) {
                                            return null;
                                        }
                                        return (
                                            <Menu.Item>
                                                <div className={styles.navItem}>
                                                    <RemoveFromAlbum
                                                        albumId={props.match.id}
                                                        thumbnails={thumbnails}
                                                        setThumbnails={setThumbnails}
                                                        selectedThumbnails={selectedThumbnails}
                                                        setSelectedThumbnails={setSelectedThumbnails}
                                                    />
                                                </div>
                                            </Menu.Item>
                                        );
                                    }}
                                </Match>
                            </Menu>
                        }>
                        <Icon type="minus-circle" theme="twoTone" twoToneColor="#eb2f96" style={{ fontSize: '24px' }} />
                    </Dropdown>
                </div>

                {/* Additional Actions */}
                <div className={styles.navItem}>
                    <Dropdown
                        trigger={['click']}
                        overlayClassName={styles.navDropdown}
                        overlay={
                            <Menu>
                                <Menu.Item>
                                    <Match path="/app/">
                                        {props1 => (
                                            <Match path="/app/albums/:id">
                                                {props2 => {
                                                    if (props1.match || props2.match) {
                                                        return (
                                                            <div className={styles.navItem}>
                                                                <Download
                                                                    useServer={useServer}
                                                                    selectedThumbnails={selectedThumbnails}
                                                                    setSelectedThumbnails={setSelectedThumbnails}
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                }}
                                            </Match>
                                        )}
                                    </Match>
                                </Menu.Item>
                            </Menu>
                        }>
                        <Icon type="more" style={{ fontSize: '24px' }} />
                    </Dropdown>
                </div>

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
