import { Disposable } from '../common/disposable/Disposable';
import { GraphicAssetCollection } from './GraphicAssetCollection';
import { IAssetManager } from './IAssetManager';
import { IAssetData } from './interfaces';
import { AssetLoader } from './loaders/AssetLoader';
import { ImageLoader } from './loaders/ImageLoader';

export class AssetManager extends Disposable implements IAssetManager
{
    private _textures: Map<string, PIXI.Texture>;
    private _collections: Map<string, GraphicAssetCollection>;

    private _pendingCallbacks: Map<string, Function[]>;

    constructor()
    {
        super();

        this._textures      = new Map();
        this._collections   = new Map();

        this._pendingCallbacks  = new Map();
    }

    public getTexture(name: string): PIXI.Texture
    {
        if(!name) return null;

        const existing = this._textures.get(name);

        if(!existing) return null;

        return existing;
    }

    public setTexture(name: string, texture: PIXI.Texture): void
    {
        if(!name || !texture) return;

        this._textures.set(name, texture);
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

        if(!urls || !urls.length) return cb(true);

        let downloadUrls: string[] = [];

        for(let url of urls)
        {
            if(!url) continue;

            const existing = this._pendingCallbacks.get(url);

            if(existing)
            {
                if(existing.indexOf(cb) >= 0) continue;

                existing.push(cb);

                continue;
            }

            this._pendingCallbacks.set(url, [ cb ]);

            downloadUrls.push(url);
        }

        for(let url of downloadUrls) this.downloadAsset(url);
    }

    private downloadAsset(url: string): void
    {
        const loader = new PIXI.Loader();

        loader
            .use(AssetLoader)
            .add(url)
            .on('complete', () => this.onChuckDownloaded(loader, url))
            .load();
    }

    public downloadImages(urls: string[], cb: Function): void
    {
        if(!cb) return;

        if(!urls || !urls.length) return cb(true);

        let downloadUrls: string[] = [];

        for(let url of urls)
        {
            if(!url) continue;

            const existing = this._pendingCallbacks.get(url);

            if(existing)
            {
                if(existing.indexOf(cb) >= 0) continue;

                existing.push(cb);

                continue;
            }

            this._pendingCallbacks.set(url, [ cb ]);

            downloadUrls.push(url);
        }

        for(let url of downloadUrls) this.downloadImage(url);
    }

    private downloadImage(url: string): void
    {
        const loader = new PIXI.Loader();

        loader
            .use(ImageLoader)
            .add(url)
            .on('complete', () => this.onChuckDownloaded(loader, url))
            .load();
    }

    private onChuckDownloaded(loader: PIXI.Loader, url: string): void
    {
        if(loader) loader.destroy();

        const callbacks = this._pendingCallbacks.get(url);

        if(!callbacks || !callbacks.length) return;

        for(let callback of callbacks)
        {
            if(!callbacks) continue;

            callback(true);
        }

        this._pendingCallbacks.delete(url);
    }
}