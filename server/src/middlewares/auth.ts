import {
    verifyAuthResponse,
    getFile,
    putFile,
    deleteFile,
    UserSession,
    handlePendingSignIn,
    connectToGaiaHub,
    getAddressFromDID,
    AppConfig,
} from 'blockstack';
import { decryptPrivateKey } from 'blockstack/lib/auth/authMessages';
import request from 'request-promise';
import { decodeToken } from 'jsontokens';
import { success, error } from '../utils/response';
import { SessionDataStore } from 'blockstack/lib/auth/sessionStore';
import { UserData } from 'blockstack/lib/auth/authApp';
import { IResponse } from 'src/interfaces/http.interface';
import { IUserCache } from '../interfaces/cache.interface';
import NodeCache from 'node-cache';

const userCache = new NodeCache({ stdTTL: 3600 }); /** Cache for an hour */

const getUserData = async (authResponseToken, transitKey) => {
    try {
        const valid = await verifyAuthResponse(authResponseToken, 'https://core.blockstack.org/v1/names');
        const tokenPayload: any = decodeToken(authResponseToken).payload; /** This token lasts for a month */
        if (!valid || !tokenPayload) {
            throw new Error('Invalid authResponse in header.');
        }
        const userJSON = await request(tokenPayload.profile_url);
        const userData = JSON.parse(userJSON)[0].decodedToken;
        const appPrivateKey = decryptPrivateKey(transitKey, tokenPayload.private_key);
        const identityAddress = getAddressFromDID(tokenPayload.iss);
        const username = tokenPayload.username;
        let gaiaHubConfig = {};

        let userCacheData: IUserCache = userCache.get(username);
        if (!userCacheData || userCacheData.authResponseToken !== authResponseToken || userCacheData.transitKey !== transitKey) {
            gaiaHubConfig = await connectToGaiaHub(tokenPayload.hubUrl, appPrivateKey, tokenPayload.associationToken);
            userCache.set(username, {
                gaiaHubConfig,
                authResponseToken,
                transitKey,
            });
        } else {
            gaiaHubConfig = userCacheData.gaiaHubConfig;
        }

        return success({
            appPrivateKey,
            authResponseToken,
            username,
            gaiaHubConfig,
            identityAddress,
            decentralizedID: tokenPayload.iss,
            gaiaAssociationToken: tokenPayload.associationToken,
            hubUrl: tokenPayload.hubUrl,
            profile: userData.payload.claim,
        });
    } catch (err) {
        return error(err);
    }
};

export const authenticate = async (req, res: IResponse, next) => {
    const authResponseToken = req.headers['x-auth-response'];
    const transitKey = req.headers['x-auth-transit-key'];

    if (!authResponseToken || !transitKey) {
        next();
    } else {
        const userDataRes = await getUserData(authResponseToken, transitKey);
        if (userDataRes.status === 'success') {
            const appConfig = new AppConfig(
                ['store_write', 'publish_data'],
                process.env.APP_ENV === 'dev' ? 'http://localhost:3000' : `https://${process.env.APP_ENV}-boto-server.herokuapp.com`
            );
            const userSession = new UserSession({ appConfig });
            const userData = userDataRes.data;
            const sessionData = userSession.store.getSessionData();
            sessionData.userData = userData;
            userSession.store.setSessionData(sessionData);
            res.blockstack = {
                getFile: (path, options) => getFile(path, options, userSession),
                putFile: (path, content, options) => putFile(path, content, options, userSession),
                deleteFile: (path, options) => deleteFile(path, options, userSession),
            };
            next();
        } else {
            res.status(401).json(error(userDataRes.data.message));
        }
    }
};
