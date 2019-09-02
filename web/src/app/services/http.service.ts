import { getAuthResponseToken } from 'blockstack/lib/auth/authApp';
import axios, { AxiosRequestConfig } from 'axios';
import { IRequestBody, IRequestHeaders } from '../interfaces/http.interface';

const getHeaders = (): IRequestHeaders => {
    let blockStackSession = JSON.parse(window.localStorage.getItem('blockstack-session'));
    let transitKey = blockStackSession.transitKey;
    let authResponse = blockStackSession.userData.authResponseToken;
    return { 'x-auth-response': authResponse, 'x-auth-transit-key': transitKey };
};

const makeGaiaRequest = async (requestType: 'get' | 'put' | 'delete', body: IRequestBody) => {
    let headers = getHeaders();
    let res = await axios.post(`${process.env.GATSBY_RADIKS_SERVER_URL}/gaia/${requestType}`, body, {
        headers,
    });
    return res.data;
};

export const gaiaGet = (body: IRequestBody) => {
    return makeGaiaRequest('get', body);
};

export const gaiaPut = (body: IRequestBody) => {
    return makeGaiaRequest('put', body);
};

export const gaiaDelete = (body: IRequestBody) => {
    return makeGaiaRequest('delete', body);
};
