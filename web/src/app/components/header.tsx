import React from 'react';
import { Link, navigate } from 'gatsby';

// State
import { Button, Layout, Icon, Upload, Avatar, Menu, Dropdown, Progress } from 'antd';
import { checkIsSignedIn, getUser, logout, handleLogin } from '../services/auth.service';
import { handleFileUpload } from '../hooks/photos.hooks';
import { useProgressContext } from '../contexts/ProgressContext';

// UI
import styles from './header.module.css';

const { Header } = Layout;

function PageHeader() {
    const [checking, setChecking] = React.useState(true);
    const [signedIn, setSignedIn] = React.useState(false);
    const userData = getUser();
    const userName = userData.username !== undefined && userData.username.split('.')[0];

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

    const progressCtx = useProgressContext();
    // Cool, you got notification, now create hook completion rate into progress somehow
    // Message: Show progress bar
    // Description: Display number of items completed
    // progressCtx.notify({
    //     message: (
    //         <div>
    //             Message<Progress percent={50}></Progress>
    //         </div>
    //     ),
    //     description: (
    //         <div>
    //             Description<Progress percent={100}></Progress>
    //         </div>
    //     ),
    //     onClick: () => {
    //         console.log('Notification Clicked!');
    //     },
    //     duration: 0,
    // });

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
                    <Upload listType="picture" multiple onChange={e => handleFileUpload(e)} showUploadList={false}>
                        <Button>
                            <Icon type="upload" /> Upload
                        </Button>
                    </Upload>
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
