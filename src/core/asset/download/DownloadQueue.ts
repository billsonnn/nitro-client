import { IDownloadable } from './IDownloadable';
import { IDownloadQueue } from './IDownloadQueue';

export class DownloadQueue implements IDownloadQueue
{
    private _queued: { object: IDownloadable, cb: Function }[];

    private _isDownloading: boolean;

    constructor()
    {
        this._queued = [];

        this._isDownloading = false;
    }

    public startDownloading(fromQueue: boolean = false): void
    {
        if(this._isDownloading && fromQueue) return;

        this._isDownloading = true;

        const queued = this._queued.shift();

        if(!queued || !queued.object || !queued.cb) return this.downloadNext();

        queued.object.download(() =>
        {
            queued.cb(true);

            this.downloadNext();
        });
    }

    public downloadNext(): void
    {
        if(this._queued.length) return this.startDownloading();

        this._isDownloading = false;
    }

    public queueObject(object: IDownloadable, cb: Function): void
    {
        this._queued.push({ object, cb });

        this.startDownloading(true);
    }
}