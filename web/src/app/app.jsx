import React from 'react';
import { Router } from '@reach/router';
import loadable from '@loadable/component';
import styles from './app.module.css';

// UI
import Layout from './components/layout';
import PrivateRoute from './components/privateRoute.tsx';
import { useOverlay } from './contexts/OverlayContext';
import { usePhotoContext } from './contexts/PhotoContext';
import { Icon } from 'antd';

// Screens
const Photo = loadable(() => import('./screens/Photo'));
// const Album = loadable(() => import('./screens/Album'));
// const Sharing = loadable(() => import('./screens/Sharing'));

export const APP_ROOT = 'APP_ROOT';
export const OVERLAY_ROOT = 'OVERLAY_ROOT';

function App() {
    const { setOverlayVisible } = useOverlay();
    const { loadingLightBox } = usePhotoContext();

    return (
        <div className={styles.root}>
            {loadingLightBox && (
                <div className={styles.loadingOverlay}>
                    <Icon className={styles.loadingIcon} type="loading" />
                </div>
            )}
            <div
                id={APP_ROOT}
                onDrop={e => e.preventDefault()}
                onDragEnter={() => {
                    setOverlayVisible(true);
                }}
                onDragLeave={e => {
                    e.persist();
                    if (e.pageX <= 0 && e.pageY <= 0) {
                        setOverlayVisible(false);
                    }
                }}>
                <Layout>
                    <Router>
                        <PublicRoute path="/app">
                            <PrivateRoute path="/" component={Photo} />
                            {/* <PrivateRoute exact path="/albums" component={Album} /> */}
                            {/* <PrivateRoute exact path="/sharing" component={Sharing} />/ */}
                        </PublicRoute>
                    </Router>
                </Layout>
            </div>
            <div id={OVERLAY_ROOT}></div>
        </div>
    );
}

function PublicRoute(props) {
    return <div>{props.children}</div>;
}

export default React.memo(App);
