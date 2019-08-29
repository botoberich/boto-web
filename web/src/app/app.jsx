import React from 'react';
import { Router } from '@reach/router';
import loadable from '@loadable/component';

// State
import { useOverlay } from './contexts/OverlayContext';
import { usePhotoContext } from './contexts/PhotoContext';

// UI
import AppLayout from './components/layout';
import PrivateRoute from './components/privateRoute';
import { Icon, Layout } from 'antd';
import styles from './app.module.css';

// Screens
const Photo = loadable(() => import('./screens/Photo'));
const Album = loadable(() => import('./screens/Album'));
const DetailedAlbum = loadable(() => import('./screens/AlbumDetailed'));
const NewAlbum = loadable(() => import('./screens/AlbumNew'));
const ApiTestScreen = loadable(() => import('./screens/api.test'));
// const Sharing = loadable(() => import('./screens/Sharing'));

export const APP_ROOT = 'APP_ROOT';
export const OVERLAY_ROOT = 'OVERLAY_ROOT';
const { Footer } = Layout;

function App() {
    return (
        <div className={styles.root}>
            <LightBoxLoader></LightBoxLoader>
            <AppRoot>
                <AppLayout>
                    <Router>
                        <PublicRoute path="/app">
                            <PrivateRoute path="/" component={Photo} />
                            <PrivateRoute exact path="/albums" component={Album} />
                            <PrivateRoute exact path="/albums/new" component={NewAlbum} />
                            <PrivateRoute exact path="/albums/:albumID" component={DetailedAlbum} />
                            <PrivateRoute path="/test" component={ApiTestScreen} />
                            {/* <PrivateRoute exact path="/sharing" component={Sharing} />/ */}
                        </PublicRoute>
                    </Router>
                </AppLayout>
            </AppRoot>
            <Footer className={styles.footer}>© {new Date().getFullYear()}, Built for you</Footer>
            <div id={OVERLAY_ROOT}></div>
        </div>
    );
}

function PublicRoute(props) {
    return <div>{props.children}</div>;
}

function AppRoot(props) {
    const { setOverlayVisible } = useOverlay();
    return (
        <div
            id={APP_ROOT}
            onDrop={e => e.preventDefault()}
            onDragEnter={() => setOverlayVisible(true)}
            onDragLeave={e => {
                e.persist();
                if (e.pageX <= 0 && e.pageY <= 0) {
                    setOverlayVisible(false);
                }
            }}>
            {props.children}
        </div>
    );
}

function LightBoxLoader() {
    const { loadingLightBox } = usePhotoContext();

    if (loadingLightBox) {
        return (
            <div className={styles.loadingOverlay}>
                <Icon className={styles.loadingIcon} type="loading" />
            </div>
        );
    }

    return null;
}

export default React.memo(App);
