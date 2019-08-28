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
import { IResponse } from 'src/interfaces/response.interface';

const getUserData = async (authResponseToken, transitKey) => {
    try {
        const valid = await verifyAuthResponse(authResponseToken, 'https://core.blockstack.org/v1/names');
        const tokenPayload: any = decodeToken(authResponseToken).payload;

        if (!valid || !tokenPayload) {
            throw new Error('Invalid authResponse in header');
        }
        const userJSON = await request(tokenPayload.profile_url);
        const userData = JSON.parse(userJSON)[0].decodedToken;
        const appPrivateKey = decryptPrivateKey(transitKey, tokenPayload.private_key);
        const identityAddress = getAddressFromDID(tokenPayload.iss);
        const gaiaHubConfig = await connectToGaiaHub(tokenPayload.hubUrl, appPrivateKey, tokenPayload.associationToken);

        return success({
            appPrivateKey,
            authResponseToken,
            decentralizedID: tokenPayload.iss,
            gaiaAssociationToken: tokenPayload.associationToken,
            gaiaHubConfig,
            hubUrl: tokenPayload.hubUrl,
            identityAddress,
            profile: userData.payload.claim,
            username: tokenPayload.username,
        });
    } catch (err) {
        return error(err);
    }
};

export const authenticate = async (req, res: IResponse, next) => {
    const authResponseToken = req.headers['x-auth-response'];
    const transitKey = req.headers['x-auth-transit-key'];
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
        res.status(401).json(error(userDataRes.data));
    }
};
