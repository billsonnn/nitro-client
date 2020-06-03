import * as PIXI from 'pixi.js-legacy';
import { AssetManager } from './AssetManager';
import { GraphicAsset } from './GraphicAsset';
import { IAsset, IAssetData } from './interfaces';

export class GraphicAssetCollection
{
    private _name: string;
    private _data: IAssetData;
    private _textures: Map<string, PIXI.Texture>;
    private _assets: Map<string, GraphicAsset>;

    constructor(data: IAssetData, spritesheet: PIXI.Spritesheet)
    {
        if(!data) throw new Error('invalid_collection');

        this._name      = data.name;
        this._data      = data;
        this._textures  = new Map();
        this._assets    = new Map();

        if(spritesheet) this.setTextures(spritesheet.textures);
        
        this.buildAssets(data.assets);
    }

    private setTextures(textures: PIXI.Texture[]): void
    {
        if(!textures) return;

        for(let name in textures)
        {
            if(!name) continue;

            const texture = textures[name];

            if(!texture) continue;

            name = AssetManager.removeFileExtension(name);

            this._textures.set(name, texture);
        }
    }

    private buildAssets(assets: { [index: string]: IAsset }): void
    {
        if(!assets) return;

        for(let name in assets)
        {
            if(!name) continue;

            const asset = assets[name];

            if(!asset) continue;

            let source = (asset.source) ? asset.source : name;

            if(!source) continue;

            const texture = this.getTexture(source);

            if(!texture) continue;

            if(!this.addAsset(name, texture, false, (asset.x || 0), (asset.y || 0), asset.flipH || false, false, source)) return;
        }
    }

    public addAsset(name: string, texture: PIXI.Texture, override: boolean, x: number, y: number, flipH: boolean, flipV: boolean, source: string = null): boolean
    {
        const existing = this.getAsset(name);

        if(!existing)
        {
            const graphic = GraphicAsset.createAsset(name, source, texture, x, y, flipH, flipV);

            if(!graphic) return false;

            this._assets.set(name, graphic);

            return true;
        }

        if(override)
        {
            if(existing.texture && (existing.texture !== texture)) this.removeAsset(name);

            const graphic = GraphicAsset.createAsset(name, source, texture, x, y, flipH, flipV);

            if(!graphic) return false;

            this._assets.set(name, graphic);

            return true;
        }

        return false;
    }

    public getTexture(name: string): PIXI.Texture
    {
        if(!name) return null;

        name = this._name + '_' + name;

        const texture = this._textures.get(name);

        if(!texture) return null;

        return texture;
    }

    public getAsset(name: string): GraphicAsset
    {
        if(!name) return null;

        const existing = this._assets.get(name);

        if(!existing) return null;

        return existing;
    }

    public removeAsset(name: string): void
    {
        if(!name) return;

        const existing = this.getAsset(name);

        if(!existing) return;

        this._assets.delete(name);

        existing.dispose();
    }

    public get name(): string
    {
        return this._name;
    }

    public get data(): IAssetData
    {
        return this._data;
    }

    public get textures(): Map<string, PIXI.Texture>
    {
        return this._textures;
    }

    public get assets(): Map<string, GraphicAsset>
    {
        return this._assets;
    }
}