import React from 'react';
import { Link, navigate } from 'gatsby';

// State
import { Button, Layout, Icon, Upload, Avatar, Menu, Dropdown } from 'antd';
import { checkIsSignedIn, getUser, logout, handleLogin } from '../services/auth.service';
import { handleFileUpload } from '../hooks/photos.hooks';

// UI
import styles from './header.module.css';

const { Header } = Layout;

function PageHeader() {
    const [checking, setChecking] = React.useState(true);
    const [signedIn, setSignedIn] = React.useState(false);

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

    const userData = getUser();
    const userName = userData.username !== undefined && userData.username.split('.')[0];

    const menu = (
        <Menu>
            {/* <Menu.Item>
                <Link to="/app/profile">Profile</Link>
            </Menu.Item> */}
        <Menu.Item>
                <AuthMenuItem signedIn={signedIn} />
            </Menu.Item>
      </Menu>
    );

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
                <Icon type="upload" />
                {' '}
Upload
                        </Button>
                    </Upload>
          </div>
                <div className={styles.navItem}>
            <Dropdown overlay={menu}>
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
                    logout(() => navigate(`/app/login`));
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
