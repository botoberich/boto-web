import React from 'react';
import { Link } from 'gatsby';
import { Location } from '@reach/router';

// UI
import { Icon, Layout, Menu, Switch } from 'antd';
import Logo from './logo';
import styles from './sideNav.module.css';

const { Sider } = Layout;

const Sidebar = () => {
    const [selected, setSelected] = React.useState('photos');

    return (
        <Location>
            {({ location }) => {
                const pathParts = location.pathname.split('/').filter(str => str !== '');
                const headerTitle = pathParts.length > 1 ? pathParts[1] : 'photos';
                setSelected(headerTitle);

                return (
                    <Sider breakpoint="lg" className={styles.sider} collapsedWidth="0" width={140} theme="light">
                        <div className="logo" />
                        <Menu mode="inline" selectedKeys={[selected]}>
                            <Logo />
                            <Menu.Item key="photos" className={styles.menuItem}>
                                <Link to="/app/">
                                    <Icon type="picture" />
                                    <span className="nav-text">Photos</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="albums" className={styles.menuItem}>
                                <Link to="/app/albums">
                                    <Icon type="book" />
                                    <span className="nav-text">Albums</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="sharing" className={styles.menuItem} disabled>
                                <Link to="/app/sharing">
                                    <Icon type="upload" />
                                    <span className="nav-text">Sharing</span>
                                </Link>
                            </Menu.Item>
                            <div className={styles.menuItem}>
                                <span className={styles.themeToggleText}>Toggle Server Compute</span>
                                <Switch
                                    onChange={() => {
                                        console.log('toggling');
                                    }}></Switch>
                            </div>
                            {/* 
                            <div className={styles.menuItem}>
                                <span className={styles.themeToggleText}>
                                    {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode
                                </span>
                                <Switch onChange={toggleTheme}></Switch>
                            </div> 
                            */}
                        </Menu>
                    </Sider>
                );
            }}
        </Location>
    );
};

export default Sidebar;
