import { Response } from 'express';
import { GetFileOptions, PutFileOptions } from 'blockstack';

export interface IResponse extends Response {
    blockstack: BlockstackFns;
}

interface BlockstackFns {
    getFile: (path: string, options?: GetFileOptions) => Promise<string | ArrayBuffer>;
    deleteFile: (path: string, options?: { wasSigned: boolean }) => Promise<void>;
    putFile: (path: string, content: string | Buffer, options?: PutFileOptions) => Promise<string>;
}
