import { MatchRenderProps } from '@reach/router';

export interface ProgressStartingPayload {
    length: number;
    cmd: 'Upload' | 'Delete' | 'Download' | 'Update';
}

interface IMatchParams {
    id: string;
    title: string;
    param?: string;
}

export interface IMatchProps extends MatchRenderProps<IMatchParams> {
    id?: string;
}
