import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';

// State
import { checkIsSignedIn, logout } from '../../services/auth.service';

// UI
import { Button, Layout, Icon } from 'antd';
import styles from './header.module.css';
import AuthButton from '../AuthButton';

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

    return (
        <Header className={styles.header}>
            <span className={styles.headerTitle}>Photos</span>
            {checking && (
                <div className={styles.indicator}>
                    <Icon type="loading" />
                </div>
            )}
            <nav className={`${styles.desktopOnly} ${styles.nav}`}>
                <Button className={styles.navItem}>
                    <Link to="/app/profile">Profile</Link>
                </Button>
                <AuthButton signedIn={signedIn} className={styles.navItem} />
            </nav>
        </Header>
    );
}

PageHeader.propTypes = {
    siteTitle: PropTypes.string,
};

PageHeader.defaultProps = {
    siteTitle: ``,
};

export default PageHeader;
