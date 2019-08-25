import React from 'react';
import { Link, navigate } from 'gatsby';

// State
import { Button, Layout, Icon, Avatar, Menu, Dropdown, Badge, Tag, notification, Typography, Tooltip } from 'antd';
import { checkIsSignedIn, getUser, logout, handleLogin } from '../services/auth.service';
import { handleFileUpload, handleDeletePhotos, handleDownloadPhotos } from '../hooks/photos.hooks';
import { useProgressContext } from '../contexts/ProgressContext';
import { usePhotoContext } from '../contexts/PhotoContext';

// UI
import styles from './header.module.css';
import { ArgsProps } from 'antd/lib/notification';

const { Header } = Layout;

function PageHeader() {
    const [signedIn, setSignedIn] = React.useState(false);
    const userData = getUser();
    const userName = userData.username !== undefined && userData.username.split('.')[0];
    const { selectedThumbnails, setSelectedThumbnails, setThumbnails, setloadingThumbnails } = usePhotoContext();
    const { Paragraph } = Typography;
    const notificationConfig = (msg: string): ArgsProps => ({
        placement: 'bottomRight',
        bottom: 50,
        duration: 3,
        message: (
            <div>
                <Paragraph>{msg}</Paragraph>
            </div>
        ),
    });
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

    const { progressDispatch } = useProgressContext();

    return (
        <Header className={styles.header}>
            <span className={styles.headerTitle}>Photos</span>
            <nav className={styles.nav}>
                <div className={styles.navItem}>
                    {selectedThumbnails.length > 0 && (
                        <Tag className={styles.tag} color="#f50">
                            {selectedThumbnails.length}
                            <span className={styles.hideMobile}>&nbsp;selected</span>
                        </Tag>
                    )}
                </div>
                <div className={styles.navItem}>
                    <label className={styles.uploadFileLabel}>
                        <input
                            className={styles.uploadFile}
                            multiple
                            accept="image/*"
                            onChange={e => {
                                handleFileUpload(e, {
                                    onStart: payload => progressDispatch({ type: 'START', payload }),
                                    onNext: res => {
                                        setThumbnails(thumbnails => {
                                            let photoId = res.metaData._id;
                                            let dateString = new Date(res.metaData.createdAt).toDateString();
                                            let copy = { ...thumbnails };
                                            copy[dateString] = copy[dateString]
                                                ? { ...copy[dateString], ...{ [photoId]: res } }
                                                : { [photoId]: res };
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
                        <span className={`${styles.ml8} ${styles.hideMobile}`}>Upload</span>
                    </label>
                </div>
                <div className={styles.navItem}>
                    <Tooltip
                        placement="bottom"
                        title={selectedThumbnails.length === 0 ? 'Please select at least one photo.' : ''}>
                        <Button
                            disabled={selectedThumbnails.length === 0}
                            onClick={() => {
                                handleDeletePhotos([...selectedThumbnails], {
                                    onStart: payload => {
                                        setloadingThumbnails(selectedThumbnails);
                                        progressDispatch({ type: 'START', payload });
                                    },
                                    onNext: metaData => {
                                        setThumbnails(thumbnails => {
                                            let dateString = new Date(metaData.createdAt).toDateString();
                                            let copy = { ...thumbnails };
                                            delete copy[dateString][metaData._id];
                                            if (Object.keys(copy[dateString]).length === 0) {
                                                delete copy[dateString];
                                            }
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
                            <span className={styles.hideMobile}>Delete</span>
                        </Button>
                    </Tooltip>
                </div>
                <div className={styles.navItem}>
                    <Tooltip
                        placement="bottom"
                        title={selectedThumbnails.length === 0 ? 'Please select at least one photo.' : ''}>
                        <Button
                            disabled={selectedThumbnails.length === 0}
                            onClick={e => {
                                try {
                                    handleDownloadPhotos(selectedThumbnails);
                                    notification.success(
                                        notificationConfig(
                                            `Successfully downloaded ${
                                                selectedThumbnails.length > 1 ? 'files' : 'file'
                                            }.`
                                        )
                                    );
                                } catch (err) {
                                    notification.error(
                                        notificationConfig(`Error downloading files. Please contact support.`)
                                    );
                                }

                                setSelectedThumbnails([]);
                            }}>
                            <Icon type="copy" theme="twoTone" twoToneColor="#52c41a" />
                            <span className={styles.hideMobile}>Download</span>
                        </Button>
                    </Tooltip>
                </div>
                <div className={styles.navItem} style={{ marginLeft: '25px' }}>
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
                            <span className={`${styles.hideMobile} ${styles.userName}`}>{userName}</span>
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
