import React from 'react';
import { Link, navigate } from 'gatsby';

// State
import { Button, Layout, Icon, Upload, Avatar, Menu, Dropdown, Input } from 'antd';
import { checkIsSignedIn, getUser, logout, handleLogin } from '../services/auth.service';
import { handleFileUpload, handleDeletePhotos } from '../hooks/photos.hooks';
import { useProgressContext } from '../contexts/ProgressContext';

// UI
import styles from './header.module.css';
import { usePhotoContext } from '../contexts/PhotoContext';

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
    // If you want to see the progress bar go, uncomment this
    // React.useEffect(() => {
    //     let counter = 0;
    //     progressDispatch({ type: 'TOTAL', payload: 10 });
    //     const timer = setInterval(() => {
    //         counter++;
    //         if (counter > 10) {
    //             progressDispatch({ type: 'END' });
    //             return;
    //         }
    //         progressDispatch({ type: 'NEXT' });
    //     }, 1000);

    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, []);

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
                    <label className={styles.uploadFileLabel}>
                        <input
                            className={styles.uploadFile}
                            multiple
                            onChange={e => {
                                let uploadedThumbnails = [];
                                handleFileUpload(e, {
                                    onStart: payload => progressDispatch({ type: 'START', payload }),
                                    onNext: res => {
                                        uploadedThumbnails.push({
                                            id: res.photoId,
                                            src: `data:image/png;base64,${res.thumbnail}`,
                                        });
                                        progressDispatch({ type: 'NEXT' });
                                    },
                                    onComplete: () => {
                                        /** only update after all uploads complete*/
                                        setThumbnails(prev => {
                                            return [...prev, ...uploadedThumbnails];
                                        });
                                        progressDispatch({ type: 'END' });
                                    },
                                });
                            }}
                            type="file"
                        />
                        <i aria-label="Upload Icon" className="anticon anticon-upload">
                            <svg
                                viewBox="64 64 896 896"
                                data-icon="upload"
                                width="1em"
                                height="1em"
                                fill="currentColor"
                                aria-hidden="true"
                                focusable="false">
                                <path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path>
                            </svg>
                        </i>
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
                                onNext: id => {
                                    /** have to do this because thumbnails could get set after the next photo is deleted */
                                    deletedIds.push(id);
                                    let newList = thumbnails.filter(
                                        thumbnail => deletedIds.indexOf(thumbnail.id) === -1
                                    );
                                    setThumbnails(newList);
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
