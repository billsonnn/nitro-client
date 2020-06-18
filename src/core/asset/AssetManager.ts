import { GraphicAssetCollection } from '../../room/object/visualization/utils/GraphicAssetCollection';
import { IGraphicAsset } from '../../room/object/visualization/utils/IGraphicAsset';
import { IGraphicAssetCollection } from '../../room/object/visualization/utils/IGraphicAssetCollection';
import { Disposable } from '../common/disposable/Disposable';
import { IAssetManager } from './IAssetManager';
import { IAssetData } from './interfaces';
import { AssetLoader } from './loaders/AssetLoader';

export class AssetManager extends Disposable implements IAssetManager
{
    private _textures: Map<string, PIXI.Texture>;
    private _collections: Map<string, GraphicAssetCollection>;
    private _pendingUrls: Map<string, Function[]>;

    constructor()
    {
        super();

        this._textures          = new Map();
        this._collections       = new Map();
        this._pendingUrls       = new Map();
    }

    public static removeFileExtension(name: string): string
    {
        return (name.substring(0, name.lastIndexOf('.')) || name);
    }

    public getTexture(name: string): PIXI.Texture
    {
        if(!name) return null;

        const existing = this._textures.get(AssetManager.removeFileExtension(name));

        if(!existing) return null;

        return existing;
    }

    public setTexture(name: string, texture: PIXI.Texture): void
    {
        if(!name || !texture) return;

        name = AssetManager.removeFileExtension(name);

        this._textures.set(name, texture);
    }

    public getAsset(name: string): IGraphicAsset
    {
        if(!name) return null;

        for(let collection of this._collections.values())
        {
            if(!collection) continue;

            const existing = collection.getAsset(name);

            if(!existing) continue;

            return existing;
        }

        return null;
    }

    public getCollection(name: string): IGraphicAssetCollection
    {
        if(!name) return null;

        const existing = this._collections.get(name);

        if(!existing) return null;

        return existing;
    }

    public createCollection(data: IAssetData, spritesheet: PIXI.Spritesheet): IGraphicAssetCollection
    {
        if(!data) return null;

        const collection = new GraphicAssetCollection(data, spritesheet);

        if(collection)
        {
            for(let [ name, texture ] of collection.textures.entries()) this.setTexture(name, texture);

            this._collections.set(collection.name, collection);
        }
    }

    public downloadAssets(urls: string[], cb: Function): void
    {
        if(!cb) return;

        if(!urls || !urls.length) return cb(true);

        let downloadUrls: string[] = [];

        for(let url of urls)
        {
            if(!url) continue;

            const existing = this._pendingUrls.get(url);

            if(existing)
            {
                if(existing.indexOf(cb) >= 0) continue;

                existing.push(cb);

                continue;
            }

            this._pendingUrls.set(url, [ cb ]);

            downloadUrls.push(url);
        }
        
        if(downloadUrls && downloadUrls.length)
        {
            this.downloadAsset(downloadUrls, cb);

            return;
        }

        cb(true);
    }

    private downloadAsset(urls: string[], cb: Function): void
    {
        const loader = new PIXI.Loader();

        loader
            .use(AssetLoader)
            .add(urls)
            .on('complete', () => this.onChuckDownloaded(loader, urls, cb))
            .load();
    }

    private onChuckDownloaded(loader: PIXI.Loader, urls: string[], cb: Function): void
    {
        if(loader) loader.destroy();

        if(urls && urls.length)
        {
            for(let url of urls)
            {
                if(!url) continue;

                const pendingCallbacks = this._pendingUrls.get(url);

                if(pendingCallbacks && pendingCallbacks.length)
                {
                    for(let callback of pendingCallbacks)
                    {
                        if(!callback || (callback === cb)) continue;

                        callback(true);
                    }
                }
                
                this._pendingUrls.delete(url);
            }
        }

        cb(true);
    }

    public get collections(): Map<string, GraphicAssetCollection>
    {
        return this._collections;
    }
}