import { IDownloadable } from './IDownloadable';
import { IDownloadQueue } from './IDownloadQueue';

export class DownloadQueue implements IDownloadQueue
{
    private _queued: { object: IDownloadable, cb: Function }[];

    private _autoDownload: boolean;
    private _isDownloading: boolean;

    constructor(autoDownload: boolean = true)
    {
        this._queued = [];

        this._autoDownload  = autoDownload;
        this._isDownloading = false;
    }

    public startDownloading(fromQueue: boolean = false): void
    {
        if(this._isDownloading)
        {
            if(!fromQueue) return;
        }

        this._isDownloading = true;

        const queued = this._queued.shift();

        if(!queued || !queued.object || !queued.cb) return this.downloadNext();

        queued.object.download(() =>
        {
            this.downloadNext();

            queued.cb(true);
        });
    }

    public downloadNext(): void
    {
        if(this._queued.length) return this.startDownloading(true);

        this._isDownloading = false;
    }

    public queueObject(object: IDownloadable, cb: Function): void
    {
        this._queued.push({ object, cb });

        if(this._autoDownload) this.startDownloading();
    }
}