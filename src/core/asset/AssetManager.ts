import { Disposable } from '../common/disposable/Disposable';
import { DownloadQueue } from './download/DownloadQueue';
import { IDownloadQueue } from './download/IDownloadQueue';
import { GraphicAssetCollection } from './GraphicAssetCollection';
import { IAssetManager } from './IAssetManager';
import { IAssetData } from './interfaces';
import { AssetLoader } from './loaders/AssetLoader';
import { ImageLoader } from './loaders/ImageLoader';

export class AssetManager extends Disposable implements IAssetManager
{
    private _assets: Map<string, IAssetData>;
    private _collections: Map<string, GraphicAssetCollection>;
    private _queue: IDownloadQueue;

    constructor()
    {
        super();

        this._assets        = new Map();
        this._collections   = new Map();
        this._queue         = new DownloadQueue();
    }

    public getCollection(name: string): GraphicAssetCollection
    {
        if(!name) return null;

        const existing = this._collections.get(name);

        if(!existing) return null;

        return existing;
    }

    public createCollection(data: IAssetData, spritesheet: PIXI.Spritesheet): GraphicAssetCollection
    {
        if(!data || !spritesheet) return null;

        const collection = new GraphicAssetCollection(data, spritesheet);

        this._collections.set(collection.name, collection);
    }

    public downloadAssets(urls: string[], cb: Function): void
    {
        if(!cb) return;

        if(!urls) return cb(true);

        const totalUrls = urls.length;

        if(!totalUrls) return cb(true);

        const loader = new PIXI.Loader();

        loader
            .use(AssetLoader)
            .add(urls)
            .on('complete', () => this.onChuckDownloaded(loader, cb))
            .load();
    }

    public downloadImages(urls: string[], cb: Function): void
    {
        if(!cb) return;

        if(!urls) return cb(true);

        const totalUrls = urls.length;

        if(!totalUrls) return cb(true);

        const loader = new PIXI.Loader();

        loader
            .use(ImageLoader)
            .add(urls)
            .on('complete', () => this.onChuckDownloaded(loader, cb))
            .load();
    }

    private onChuckDownloaded(loader: PIXI.Loader, cb: Function): void
    {
        if(loader) loader.destroy();

        if(!cb) return;

        return cb(true);
    }

    public get queue(): IDownloadQueue
    {
        return this._queue;
    }
}