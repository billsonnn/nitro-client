import { AssetLoader } from './AssetLoader';
import { DownloadQueue } from './download/DownloadQueue';
import { IDownloadQueue } from './download/IDownloadQueue';
import { IAssetData } from './interfaces';

export class AssetManager
{
    private _assets: Map<string, IAssetData>;
    private _queue: IDownloadQueue;

    constructor()
    {
        this._assets    = new Map();
        this._queue     = new DownloadQueue();
    }

    public dispose(): void
    {
        return;
    }

    public getAsset(name: string): IAssetData
    {
        const existing = this._assets.get(name);

        if(!existing) return null;

        return existing;
    }

    public createAsset(name: string, data: IAssetData): IAssetData
    {
        if(!name || !data) return null;

        const existingAsset = this.getAsset(name);

        if(existingAsset) return null;

        this._assets.set(name, data);

        return data;
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

    private onChuckDownloaded(loader: PIXI.Loader, cb: Function): void
    {
        if(loader) loader.destroy();

        if(!cb) return;

        return cb(true);
    }
}