import React from 'react';
import { Link } from 'gatsby';
import { Match } from '@reach/router';

// State
// import { useService } from '../contexts/ServiceContext';
import { useServiceContext } from '../contexts/ServiceContext';

// UI
import { Icon, Layout, Menu, Switch, Modal } from 'antd';
import Logo from './logo';
import styles from './sideNav.module.css';

// Types
import { IMatchProps } from '../interfaces/ui.interface';

const { Sider } = Layout;
const { confirm } = Modal;

const Sidebar = () => {
    const { setServer, setClient, useServer } = useServiceContext();

    return (
        <Match path="/app/:title/*">
            {(props: IMatchProps) => {
                return (
                    <Sider breakpoint="lg" className={styles.sider} collapsedWidth="0" width={140} theme="light">
                        <div className="logo" />
                        <Menu mode="inline" selectedKeys={props.match ? [props.match.title] : ['photos']}>
                            <Logo />
                            <Menu.Item key="photos" className={styles.menuItem}>
                                <Link to="/app/">
                                    <Icon type="picture" />
                                    <span className="nav-text">Photos</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="albums" className={styles.menuItem}>
                                <Link to="/app/albums">
                                    <Icon type="wallet" />
                                    <span className="nav-text">Albums</span>
                                </Link>
                            </Menu.Item>
                            {/* <Menu.Item key="sharing" className={styles.menuItem} disabled>
                                <Link to="/app/sharing">
                                    <Icon type="upload" />
                                    <span className="nav-text">Sharing</span>
                                </Link>
                            </Menu.Item> */}
                            <div className={styles.serviceSelector}>
                                <Switch
                                    style={{ width: '100%' }}
                                    checked={useServer}
                                    onChange={checked => {
                                        if (!checked) {
                                            setClient();
                                            if (typeof window !== 'undefined') {
                                                window.localStorage.setItem('api-service-type', 'client');
                                            }
                                            return;
                                        }

                                        confirm({
                                            title: 'Use a server',
                                            content: serverWarningMessage,
                                            onOk() {
                                                setServer();
                                                if (typeof window !== 'undefined') {
                                                    window.localStorage.setItem('api-service-type', 'server');
                                                }
                                            },
                                        });
                                    }}
                                    unCheckedChildren={'Client'}
                                    checkedChildren={'Server'}></Switch>
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
        </Match>
    );
};

export default Sidebar;

const serverWarningMessage = `To maintain your utmost privacy and security as a
decentralized app, Boto uses your browser to do all computation, including fragmenting,
uploading, and downloading your photos. However, if you are experiencing sluggishness,
it may help to temporarily use our server to quicken the process. This means we perform
computation on our server, authorized by you.`;
