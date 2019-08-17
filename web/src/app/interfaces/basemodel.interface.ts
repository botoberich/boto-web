import { FindQuery } from 'radiks/src/api';

export interface BaseModel {
    fetchOwnList?: (selector: FindQuery) => Promise<any>;
    findById?: (_id: string, fetchOptions?: Record<string, any>) => Promise<any>;
    save?: () => Promise<any>;
    fetchList?: (_selector: FindQuery, fetchOptions?: Record<string, any>) => Promise<any>;
    destroy?: () => Promise<any>;
}
