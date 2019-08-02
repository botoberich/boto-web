import React from 'react';
import { Router } from '@reach/router';
import loadable from '@loadable/component';

// UI
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { useOverlay } from './contexts/OverlayContext';

// Screens
const Photo = loadable(() => import('./screens/Photo'));
const Profile = loadable(() => import('./screens/Profile'));
const Login = loadable(() => import('./screens/Login'));
// const Album = loadable(() => import('./screens/Album'));
// const Sharing = loadable(() => import('./screens/Sharing'));

export const APP_ROOT = 'APP_ROOT';
export const OVERLAY_ROOT = 'OVERLAY_ROOT';

function App() {
    const { setOverlayVisible } = useOverlay();

    return (
        <>
            <div
                id={APP_ROOT}
                onDrop={e => e.preventDefault()}
                onDragEnter={e => {
                    e.persist()
                    setOverlayVisible(true)
                    console.log({ e })
                }}
                onDragLeave={e => {
                    e.persist();
                    if (e.pageX <= 0 && e.pageY <= 0) {
                        setOverlayVisible(false);
                    }
                }}
            >
                <Layout>
                    <Router>
                        <PrivateRoute path="/app/profile" component={Profile} />
                        <PublicRoute path="/app">
                            <PrivateRoute path="/" component={Photo} />
                            {/* <PrivateRoute exact path="/albums" component={Album} /> */}
                            {/* <PrivateRoute exact path="/sharing" component={Sharing} />/ */}
                            <Login exact path="/login" />
                        </PublicRoute>
                    </Router>
                </Layout>
            </div>
            <div id={OVERLAY_ROOT}></div>
        </>
    );
}

function PublicRoute(props) {
    return <div>{props.children}</div>;
}

export default React.memo(App);
