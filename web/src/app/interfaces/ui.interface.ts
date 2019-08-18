export interface ProgressStartingPayload {
    length: number;
    cmd: 'Upload' | 'Delete' | 'Download' | 'Update';
}
