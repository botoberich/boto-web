import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql, Link } from 'gatsby';

// State
import { useTheme } from '../../contexts/ThemeContext';
import { checkIsSignedIn } from '../../services/auth';

// UI
import { Affix, Icon, Layout, Menu, Switch, Button } from 'antd';
import PageHeader from '../Header';
import Logo from '../Logo';
import AuthButton from '../AuthButton';
import './layout.css';
import styles from './layout.module.css';

const { Content, Footer, Sider } = Layout;

const PageLayout = ({ children }) => {
    const { toggleTheme, theme } = useTheme();
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
    });

    return (
        <StaticQuery
            query={graphql`
                query SiteTitleQuery {
                    site {
                        siteMetadata {
                            title
                        }
                    }
                }
            `}
            render={data => (
                <Layout className={styles.layout} hasSider>
                    <Sider breakpoint="lg" className={styles.sider} collapsedWidth="0" theme={theme}>
                        <div className="logo" />
                        <Menu theme={theme} mode="inline" defaultSelectedKeys={['1']}>
                            <Logo />
                            <Menu.Item key="1">
                                <Link to="/app/">
                                    <Icon type="picture" />
                                    <span className="nav-text">Photos</span>
                                </Link>
                            </Menu.Item>
                            {/* <Menu.Item key="2">
                                    <Link to="/app/albums">
                                        <Icon type="book" />
                                        <span className="nav-text">Albums</span>
                                    </Link>
                                </Menu.Item> */}
                            {/* <Menu.Item key="3">
                                    <Link to="/app/sharing">
                                        <Icon type="upload" />
                                        <span className="nav-text">Sharing</span>
                                    </Link>
                                </Menu.Item> */}
                            <Menu.Item key="4" className={styles.mobileOnly}>
                                <Link to="/app/profile">
                                    <Icon type="user" />
                                    <span className="nav-text">Profile</span>
                                </Link>
                            </Menu.Item>
                            <div className={`${styles.menuItem} ${styles.mobileOnly}`}>
                                <AuthButton signedIn={signedIn}></AuthButton>
                            </div>
                            <div className={styles.menuItem}>
                                <span className={styles.themeToggleText}>
                                    {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode
                                </span>
                                <Switch onChange={toggleTheme}></Switch>
                            </div>
                        </Menu>
                    </Sider>
                    <Layout className={styles.layout}>
                        <Affix>
                            <PageHeader siteTitle={data.site.siteMetadata.title} />
                        </Affix>
                        <Content className={styles.content}>
                            <div className={styles.children}>{children}</div>
                        </Content>
                        <Footer className={styles.footer}>© {new Date().getFullYear()}, Built for you</Footer>
                    </Layout>
                </Layout>
            )}
        />
    );
};

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PageLayout;
