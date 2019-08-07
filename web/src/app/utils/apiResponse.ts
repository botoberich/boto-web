export interface PhotoResponse {
    status: ResponseStatus | 'success' | 'error';
    data: any;
}

export enum ResponseStatus {
    Success,
    Error,
}

export function success(data: any): PhotoResponse {
    return {
        status: 'success',
        data,
    };
}

export function error(data: any): PhotoResponse {
    return {
        status: 'error',
        data,
    };
}
