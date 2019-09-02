export interface IRequestHeaders {
    'x-auth-response': string;
    'x-auth-transit-key': string;
}

export interface IRequestBody {
    path: string;
    content?: string;
}
