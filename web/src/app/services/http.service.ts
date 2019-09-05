import { getAuthResponseToken } from 'blockstack/lib/auth/authApp';
import axios, { AxiosRequestConfig } from 'axios';
import { IRequestBody, IRequestHeaders, IGaiaRequestOptions } from '../interfaces/http.interface';
import { getFile, deleteFile, putFile } from 'blockstack';

const getHeaders = (): IRequestHeaders => {
    let blockStackSession = JSON.parse(window.localStorage.getItem('blockstack-session'));
    let transitKey = blockStackSession.transitKey;
    let authResponse = blockStackSession.userData.authResponseToken;
    return { 'x-auth-response': authResponse, 'x-auth-transit-key': transitKey };
};

const makeGaiaRequest = async (method: 'get' | 'put' | 'delete', { body, options, isServer }: IGaiaRequestOptions) => {
    let headers = getHeaders();
    let result;
    if (isServer) {
        let res = await axios.post(`${process.env.GATSBY_RADIKS_SERVER_URL}/gaia/${method}`, body, {
            headers,
        });
        result = res.data ? JSON.stringify(res.data) : null;
        return result;
    }

    switch (method) {
        case 'get':
            return await getFile(body.path, options);
        case 'delete':
            return await deleteFile(body.path, options);
        case 'put':
            return await putFile(body.path, body.content, options);
    }
};

export const gaiaGet = (options: IGaiaRequestOptions) => {
    return makeGaiaRequest('get', options);
};

export const gaiaPut = (options: IGaiaRequestOptions) => {
    return makeGaiaRequest('put', options);
};

export const gaiaDelete = (options: IGaiaRequestOptions) => {
    return makeGaiaRequest('delete', options);
};
