const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { setup } = require('radiks-server');

import {
    verifyAuthResponse,
    getFile,
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

const app = express();
const PORT = process.env.PORT || (process.env.DEBUG ? 4001 : 3000);

const BASE_PATH = `user/photos`;

const constructUserData = async (authResponseToken, transitKey) => {
    try {
        const valid = await verifyAuthResponse(authResponseToken, 'https://core.blockstack.org/v1/names');
        const tokenPayload: any = decodeToken(authResponseToken).payload;

        if (!valid || !tokenPayload) {
            throw new Error('Invalid authResponse in header');
        }
        const userJSON = await request(tokenPayload.profile_url);
        const userData = JSON.parse(userJSON)[0].decodedToken;
        const profile = userData.payload.claim;
        const appPrivateKey = decryptPrivateKey(transitKey, tokenPayload.private_key);
        const decentralizedID = tokenPayload.iss;
        const gaiaAssociationToken = tokenPayload.associationToken;
        const hubUrl = tokenPayload.hubUrl;
        const username = tokenPayload.username;
        const identityAddress = getAddressFromDID(decentralizedID);
        const gaiaHubConfig = await connectToGaiaHub(hubUrl, appPrivateKey, gaiaAssociationToken);

        return success({
            appPrivateKey,
            authResponseToken,
            decentralizedID,
            gaiaAssociationToken,
            gaiaHubConfig,
            hubUrl,
            identityAddress,
            profile,
            username,
        });
    } catch (err) {
        return error(err);
    }
};

app.use(
    cors(),
    bodyParser.json({
        limit: '50mb',
    })
);

app.use('/thumbnail/:id', async (req, res, next) => {
    const authResponseToken = req.headers['x-auth-response'];
    const transitKey = req.headers['x-auth-transit-key'];
    const photoId = req.params.id;
    const userDataRes = await constructUserData(authResponseToken, transitKey);
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

        const thumbnail = await getFile(`${BASE_PATH}/${photoId}/thumbnail`, {}, userSession);

        res.json(success(JSON.parse(thumbnail.toString())));
    } else {
        res.status(401).json(error('Unable to authenticate'));
    }
    // console.log(userData);
});

app.use((req, res, next) => {
    console.log('VERIFY TOKEN MIDDLEWARE');
    console.log(req.headers);
    next();
});

app.get('/', (req, res) => {
    res.status(200).json({ ['March to Web3']: 'Alive' });
});

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'Healthy' });
});

app.listen(PORT, async () => {
    console.log(`Successfully started '${process.env.APP_ENV}' server on port ${PORT}!`);

    const RadiksController = await setup({
        mongoDBUrl: process.env.MONGODB_URL,
    });

    console.log(`Successfully connected to the '${process.env.APP_ENV}' mongodb instance.`);

    app.use('/radiks', RadiksController);
});
