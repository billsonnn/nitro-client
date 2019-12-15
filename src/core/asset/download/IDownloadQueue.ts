import { IDownloadable } from './IDownloadable';

export interface IDownloadQueue
{
    startDownloading(fromQueue?: boolean): void;
    downloadNext(): void;
    queueObject(object: IDownloadable, cb: Function): void;
}