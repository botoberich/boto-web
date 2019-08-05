import { UserSession, AppConfig } from 'blockstack';
import { configure, User } from 'radiks';

// helpful for debugging
const logAuth = process.env.NODE_ENV === 'development' && true; // set to true to turn on logging
const clog = (...args) => logAuth && console.log(...args);
// helpful for debugging

const appConfig = new AppConfig(
    ['store_write', 'publish_data'],
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000',
    '/app',
    '/manifest.webmanifest'
);
const userSession = new UserSession({ appConfig });

const PORT = process.env.PORT || 4000;

configure({
    apiServer: process.env.NODE_ENV === 'development' ? `http://localhost:${PORT}` : process.env.RADIKS_SERVER_URL,
    userSession,
});

export const isBrowser = () => typeof window !== 'undefined';

export const getUser = () => (isBrowser() && userSession.isUserSignedIn() ? userSession.loadUserData() : {});

export const handleLogin = async callback => {
    clog('isLoggedIn check', userSession.isUserSignedIn());
    if (userSession.isUserSignedIn()) {
        clog('logged in');
        callback(getUser());
    } else if (userSession.isSignInPending()) {
        let userData = await userSession.handlePendingSignIn();
        callback(userData);
    } else {
        userSession.redirectToSignIn();
    }
};

export const checkIsSignedIn = async () => {
    if (!isBrowser()) {
        // clog('Not a browser');
        return Promise.resolve(false);
    }
    if (userSession.isSignInPending()) {
        await userSession.handlePendingSignIn();
        await User.createWithCurrentUser();
        return true;
    } else if (userSession.isUserSignedIn()) {
        const user = userSession.loadUserData();
        // clog('isLoggedIn check', { user });
        return Promise.resolve(!!user);
    } else {
        // clog('isLoggedIn check - nothing');
        return Promise.resolve(false);
    }
};

export const logout = callback => {
    userSession.signUserOut('/app/login');
    callback();
};