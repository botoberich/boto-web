import React from 'react';
import { Router } from '@reach/router';
import loadable from '@loadable/component';
import styles from './app.module.css';

// UI
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { useOverlay } from './contexts/OverlayContext';

// Screens
const Photo = loadable(() => import('./screens/Photo'));
const Profile = loadable(() => import('./screens/Profile'));
// const Album = loadable(() => import('./screens/Album'));
// const Sharing = loadable(() => import('./screens/Sharing'));

export const APP_ROOT = 'APP_ROOT';
export const OVERLAY_ROOT = 'OVERLAY_ROOT';

function App() {
    const { setOverlayVisible } = useOverlay();

    return (
        <div className={styles.root}>
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
                            <PrivateRoute path="/profile" component={Profile} />
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
