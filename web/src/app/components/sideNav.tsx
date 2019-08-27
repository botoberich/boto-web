import React from 'react';
import { Link } from 'gatsby';

// UI
import { Icon, Layout, Menu, Button } from 'antd';
import Logo from './logo';
import styles from './sideNav.module.css';

const { Sider } = Layout;

const Sidebar = () => {
    return (
        <Sider breakpoint="lg" className={styles.sider} collapsedWidth="0" width={140} theme="light">
            <div className="logo" />
            <Menu mode="inline" defaultSelectedKeys={['1']}>
                <Logo />
                <Menu.Item key="1" className={styles.menuItem}>
                    <Link to="/app/">
                        <Icon type="picture" />
                        <span className="nav-text">Photos</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="2" className={styles.menuItem}>
                    <Link to="/app/albums">
                        <Icon type="book" />
                        <span className="nav-text">Albums</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="4" className={styles.menuItem} disabled>
                    <Link to="/app/sharing">
                        <Icon type="upload" />
                        <span className="nav-text">Sharing</span>
                    </Link>
                </Menu.Item>
                {/* <div className={styles.menuItem}>
                    <span className={styles.themeToggleText}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode
                    </span>
                    <Switch onChange={toggleTheme}></Switch>
                </div> */}
            </Menu>
        </Sider>
    );
};

export default Sidebar;
