export interface ApiResponse<T> {
    status: ResponseStatus | 'success' | 'error';
    data: T;
}

export enum ResponseStatus {
    Success = 'success',
    Error = 'error',
}
