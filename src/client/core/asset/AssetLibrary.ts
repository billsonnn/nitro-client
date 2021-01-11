import { Spritesheet, Texture } from 'pixi.js';
import { AssetManager } from './AssetManager';
import { IAssetLibrary } from './IAssetLibrary';
import { IAssetData } from './interfaces';

export class AssetLibrary implements IAssetLibrary
{
    private _name: string;
    private _data: IAssetData;
    private _textures: Map<string, Texture>;

    constructor(name: string)
    {
        this._name      = name;
        this._data      = null;
        this._textures  = new Map();
    }

    public dispose(): void
    {
        if(this._textures)
        {
            for(let texture of this._textures.values()) texture && texture.destroy();

            this._textures = null;
        }

        this._data  = null;
        this._name  = null;
    }

    public defineSpritesheet(spritesheet: Spritesheet): void
    {
        if(!spritesheet) return;

        this._data = spritesheet.data;

        const textures = spritesheet.textures;

        if(textures)
        {
            for(let name in textures)
            {
                const texture = textures[name];

                if(!texture) continue;

                this._textures.set(AssetManager.removeFileExtension(name), texture);
            }
        }
    }

    public getTexture(name: string): Texture
    {
        if(!name) return null;

        const existing = this._textures.get(name);

        if(!existing) return null;

        return existing;
    }

    public get name(): string
    {
        return this._name;
    }
}