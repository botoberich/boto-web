import { ApiResponse } from '../interfaces/response.interface';

export function success(data: any): ApiResponse<any> {
    return {
        status: 'success',
        data,
    };
}

export function error(data: any): ApiResponse<any> {
    return {
        status: 'error',
        data,
    };
}
