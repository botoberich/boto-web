import React from 'react';
import { Link, navigate } from 'gatsby';

// State
import { Button, Layout, Icon, Avatar, Menu, Dropdown, Badge } from 'antd';
import { checkIsSignedIn, getUser, logout, handleLogin } from '../services/auth.service';
import { handleFileUpload, handleDeletePhotos } from '../hooks/photos.hooks';
import { useProgressContext } from '../contexts/ProgressContext';
import { usePhotoContext } from '../contexts/PhotoContext';

// UI
import styles from './header.module.css';

const { Header } = Layout;

function PageHeader() {
    const [checking, setChecking] = React.useState(true);
    const [signedIn, setSignedIn] = React.useState(false);
    const userData = getUser();
    const userName = userData.username !== undefined && userData.username.split('.')[0];
    const {
        selectedThumbnails,
        setSelectedThumbnails,
        thumbnails,
        setThumbnails,
        loadingThumbnails,
        setloadingThumbnails,
    } = usePhotoContext();

    React.useEffect(() => {
        async function signin() {
            try {
                checkIsSignedIn().then(signedIn => {
                    setChecking(false);
                    setSignedIn(signedIn);
                });
            } catch (e) {
                console.log('error signing in');
                console.error(e);
            }
        }

        signin();
    }, []);

    const { progressDispatch } = useProgressContext();

    return (
        <Header className={styles.header}>
            <span className={styles.headerTitle}>Photos</span>
            {checking && (
                <div className={styles.indicator}>
                    <Icon type="loading" />
                </div>
            )}
            <nav className={`${styles.desktopOnly} ${styles.nav}`}>
                <div className={styles.navItem}>
                    <Badge count={selectedThumbnails.length}></Badge>
                </div>
                <div className={styles.navItem}>
                    <label className={styles.uploadFileLabel}>
                        <input
                            className={styles.uploadFile}
                            multiple
                            onChange={e => {
                                let uploadedThumbnails = [];
                                handleFileUpload(e, {
                                    onStart: payload => progressDispatch({ type: 'START', payload }),
                                    onNext: res => {
                                        setThumbnails(thumbnails => {
                                            let dateString = new Date(parseInt(res.metaData.createdAt)).toDateString();
                                            let copy = { ...thumbnails };
                                            copy[dateString] = copy[dateString] ? [...copy[dateString], res] : [res];
                                            return copy;
                                        });
                                        progressDispatch({ type: 'NEXT' });
                                    },
                                    onComplete: () => {
                                        progressDispatch({ type: 'END' });
                                    },
                                });
                            }}
                            type="file"
                        />
                        <Icon type="cloud-upload" style={{ color: '#1890ff' }} />
                        <span style={{ marginLeft: '8px' }}>Upload</span>
                    </label>
                    <Button
                        style={{ marginLeft: '5px' }}
                        onClick={e => {
                            let deletedIds = [];
                            handleDeletePhotos([...selectedThumbnails], {
                                onStart: payload => {
                                    setloadingThumbnails(selectedThumbnails);
                                    progressDispatch({ type: 'START', payload });
                                },
                                onNext: metaData => {
                                    setThumbnails(thumbnails => {
                                        let dateString = new Date(parseInt(metaData.createdAt)).toDateString();
                                        let newThumbnailsList = thumbnails[dateString].filter(
                                            t => t.photoId !== metaData._id
                                        );
                                        let copy = { ...thumbnails };
                                        copy[dateString] = newThumbnailsList;
                                        return copy;
                                    });
                                    progressDispatch({ type: 'NEXT' });
                                },
                                onComplete: () => {
                                    progressDispatch({ type: 'END' });
                                    setloadingThumbnails([]);
                                    setSelectedThumbnails([]);
                                },
                                onError: () => {
                                    setloadingThumbnails([]);
                                    setSelectedThumbnails([]);
                                },
                            });
                        }}>
                        <Icon type="delete" theme="twoTone" twoToneColor="#eb2f96" />
                        Delete
                    </Button>

                    <Button
                        style={{ marginLeft: '5px' }}
                        onClick={e => {
                            console.log('Downloading:', selectedThumbnails);
                        }}>
                        <Icon type="copy" theme="twoTone" twoToneColor="#52c41a" />
                        Download
                    </Button>
                </div>
                <div className={styles.navItem}>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item>
                                    <AuthMenuItem signedIn={signedIn} />
                                </Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <Avatar className={styles.avatar} icon="user" />
                            <span className={styles.userName}>{userName}</span>
                        </div>
                    </Dropdown>
                </div>
            </nav>
        </Header>
    );
}

function AuthMenuItem({ signedIn }) {
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

export default PageHeader;
