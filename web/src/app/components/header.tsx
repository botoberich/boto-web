import React from 'react';
import { Link, navigate } from 'gatsby';
import { Location, Match } from '@reach/router';

// State
import { Button, Layout, Icon, Avatar, Menu, Dropdown, Badge, Tag, notification, Typography, Tooltip } from 'antd';
import { checkIsSignedIn, getUser, logout, handleLogin } from '../services/auth.service';
import { handleFileUpload, handleDeletePhotos, handleDownloadPhotos } from './Photo/photos.hooks';
import { useProgressContext } from '../contexts/ProgressContext';
import { usePhotoContext } from '../contexts/PhotoContext';

// UI
import styles from './header.module.css';
import { ArgsProps } from 'antd/lib/notification';

// Types
import { IMatchProps } from '../interfaces/ui.interface';

const { Header } = Layout;
const { Paragraph } = Typography;
const notificationCoinfig = (msg: string): ArgsProps => ({
    placement: 'bottomRight',
    bottom: 50,
    duration: 3,
    message: (
        <div>
            <Paragraph>{msg}</Paragraph>
        </div>
    ),
});

function PageHeader() {
    const { selectedThumbnails, setSelectedThumbnails, setThumbnails, setloadingThumbnails } = usePhotoContext();
    const { progressDispatch } = useProgressContext();
    const upperFirstLetter = str => {
        return str.charAt(0).toUpperCase() + str.substr(1, str.length);
    };
    return (
        <Location>
            {props => {
                return (
                    <Header className={styles.header}>
                        <Match path="/app/:title/*">
                            {(props: IMatchProps) => {
                                console.log({ props });
                                return (
                                    <span className={styles.headerTitle}>
                                        {props.match ? props.match.title : 'photos'}
                                    </span>
                                );
                            }}
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
                            <Match path="/app/">
                                {props =>
                                    props.match && (
                                        <div className={styles.navItem}>
                                            <Upload
                                                setThumbnails={setThumbnails}
                                                progressDispatch={progressDispatch}></Upload>
                                        </div>
                                    )
                                }
                            </Match>
                            <Match path="/app/">
                                {props =>
                                    props.match && (
                                        <div className={styles.navItem}>
                                            <Delete
                                                progressDispatch={progressDispatch}
                                                selectedThumbnails={selectedThumbnails}
                                                setSelectedThumbnails={setSelectedThumbnails}
                                                setloadingThumbnails={setloadingThumbnails}
                                                setThumbnails={setThumbnails}></Delete>
                                        </div>
                                    )
                                }
                            </Match>
                            <Match path="/app/">
                                {props1 => (
                                    <Match path="/app/albums/:id">
                                        {props2 => {
                                            if (props1.match || props2.match) {
                                                return (
                                                    <div className={styles.navItem}>
                                                        <Download
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
                            <Match path="/app/albums/:id">
                                {(props: IMatchProps) => {
                                    if (!props.match) {
                                        return null;
                                    }
                                    return (
                                        <div className={styles.navItem}>
                                            <Remove
                                                albumId={props.match.id}
                                                selectedThumbnails={selectedThumbnails}
                                                setSelectedThumbnails={setSelectedThumbnails}
                                            />
                                        </div>
                                    );
                                }}
                            </Match>
                            <div className={styles.navItem} style={{ marginLeft: '25px' }}>
                                <UserAvatar></UserAvatar>
                            </div>
                        </nav>
                    </Header>
                );
            }}
        </Location>
    );
}

function Upload({ setThumbnails, progressDispatch }) {
    return (
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
    );
}

function Delete({ selectedThumbnails, setSelectedThumbnails, progressDispatch, setloadingThumbnails, setThumbnails }) {
    return (
        <Tooltip placement="bottom" title={selectedThumbnails.length === 0 ? 'Please select at least one photo.' : ''}>
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
    );
}

function Download({ selectedThumbnails, setSelectedThumbnails }) {
    return (
        <Tooltip placement="bottom" title={selectedThumbnails.length === 0 ? 'Please select at least one photo.' : ''}>
            <Button
                disabled={selectedThumbnails.length === 0}
                onClick={e => {
                    try {
                        handleDownloadPhotos(selectedThumbnails);
                        notification.success(
                            notificationConfig(
                                `Successfully downloaded ${selectedThumbnails.length > 1 ? 'files' : 'file'}.`
                            )
                        );
                    } catch (err) {
                        notification.error(notificationConfig(`Error downloading files. Please contact support.`));
                    }

                    setSelectedThumbnails([]);
                }}>
                <Icon type="copy" theme="twoTone" twoToneColor="#52c41a" />
                <span className={styles.hideMobile}>Download</span>
            </Button>
        </Tooltip>
    );
}

function Remove({ albumId, selectedThumbnails, setSelectedThumbnails }) {
    return (
        <Tooltip placement="bottom" title={selectedThumbnails.length === 0 ? 'Please select at least one photo.' : ''}>
            <Button
                disabled={selectedThumbnails.length === 0}
                // onClick={e => {
                //     try {
                //         handleDownloadPhotos(selectedThumbnails);
                //         notification.success(
                //             notificationConfig(
                //                 `Successfully downloaded ${selectedThumbnails.length > 1 ? 'files' : 'file'}.`
                //             )
                //         );
                //     } catch (err) {
                //         notification.error(notificationConfig(`Error downloading files. Please contact support.`));
                //     }

                //     setSelectedThumbnails([]);
                // }}
            >
                <Icon type="copy" theme="twoTone" twoToneColor="#52c41a" />
                <span className={styles.hideMobile}>Remove From Album</span>
            </Button>
        </Tooltip>
    );
}

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

export default PageHeader;
