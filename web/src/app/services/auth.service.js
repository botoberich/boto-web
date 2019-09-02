import { UserSession, AppConfig } from 'blockstack';
import { configure, User, GroupMembership } from 'radiks/src';

const appConfig = new AppConfig(
    ['store_write', 'publish_data'],
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000',
    '/app',
    '/manifest.webmanifest'
);
const userSession = new UserSession({ appConfig });

configure({
    apiServer: process.env.GATSBY_RADIKS_SERVER_URL || 'http://localhost:3000',
    userSession,
});

if (typeof window !== 'undefined') {
    window.localStorage.setItem('radiks-server-url', process.env.GATSBY_RADIKS_SERVER_URL);
}

export const isBrowser = () => typeof window !== 'undefined';

export const getUser = () => (isBrowser() && userSession.isUserSignedIn() ? userSession.loadUserData() : {});

export const handleLogin = async callback => {
    if (userSession.isUserSignedIn()) {
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
        return Promise.resolve(false);
    }
    if (userSession.isSignInPending()) {
        await userSession.handlePendingSignIn();

        let userFromLocalStorage = User.currentUser();
        let userFromRadiks = await User.findById(userFromLocalStorage._id);

        if (!userFromRadiks) {
            await User.createWithCurrentUser();
        } else {
            await GroupMembership.cacheKeys();
        }
        return true;
    } else if (userSession.isUserSignedIn()) {
        const user = userSession.loadUserData();
        return Promise.resolve(!!user);
    } else {
        return Promise.resolve(false);
    }
};

export const logout = callback => {
    userSession.signUserOut('/');
    callback();
};
