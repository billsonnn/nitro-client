import { AssetManager } from '../../../../core/asset/AssetManager';
import { IAsset, IAssetData, IAssetPalette } from '../../../../core/asset/interfaces';
import { Nitro } from '../../../../nitro/Nitro';
import { GraphicAsset } from './GraphicAsset';
import { GraphicAssetPalette } from './GraphicAssetPalette';
import { IGraphicAsset } from './IGraphicAsset';
import { IGraphicAssetCollection } from './IGraphicAssetCollection';

export class GraphicAssetCollection implements IGraphicAssetCollection
{
    private static PALETTE_ASSET_DISPOSE_THRESHOLD: number = 10;

    private _referenceCount: number;
    private _referenceTimestamp: number;

    private _name: string;
    private _data: IAssetData;
    private _textures: Map<string, PIXI.Texture>;
    private _assets: Map<string, GraphicAsset>;
    private _palettes: Map<string, GraphicAssetPalette>;
    private _paletteAssetNames: string[];

    constructor(data: IAssetData, spritesheet: PIXI.Spritesheet)
    {
        if(!data) throw new Error('invalid_collection');

        this._name              = data.name;
        this._data              = data;
        this._textures          = new Map();
        this._assets            = new Map();
        this._palettes          = new Map();
        this._paletteAssetNames = [];

        if(spritesheet) this.addLibraryAsset(spritesheet.textures);

        this.define(data);
    }

    public dispose(): void
    {
        if(this._palettes)
        {
            for(let palette of this._palettes.values()) palette.dispose();

            this._palettes.clear();
        }

        if(this._paletteAssetNames)
        {
            this.disposePaletteAssets();

            this._paletteAssetNames = null;
        }

        if(this._assets)
        {
            for(let asset of this._assets.values()) asset.recycle();

            this._assets.clear();
        }
    }

    public addReference(): void
    {
        this._referenceCount++;
        this._referenceTimestamp = Nitro.instance.time;
    }

    public removeReference(): void
    {
        this._referenceCount--;

        if(this._referenceCount <= 0)
        {
            this._referenceCount        = 0;
            this._referenceTimestamp    = Nitro.instance.time;

            this.disposePaletteAssets(false);
        }
    }

    public define(data: IAssetData): void
    {
        const assets    = data.assets;
        const palettes  = data.palettes;

        if(assets) this.defineAssets(assets);

        if(palettes) this.definePalettes(palettes);
    }

    private defineAssets(assets: { [index: string]: IAsset }): void
    {
        if(!assets) return;

        for(let name in assets)
        {
            const asset = assets[name];

            if(!asset) continue;

            let x           = (-(asset.x) || 0);
            let y           = (-(asset.y) || 0);
            let flipH       = false;
            let flipV       = false;
            let usesPalette = (asset.usesPalette || false);
            let source      = (asset.source || '');

            if(asset.flipH && source.length) flipH = true;

            // if(asset.flipV && source.length) flipV = true;

            if(!source.length) source = name;

            const texture = this.getLibraryAsset(source);

            if(!texture) continue;

            let didAddAsset = this.createAsset(name, source, texture, flipH, flipV, x, y, usesPalette);

            if(!didAddAsset)
            {
                const existingAsset = this.getAsset(name);

                if(existingAsset && (existingAsset.name !== existingAsset.source))
                {
                    didAddAsset = this.replaceAsset(name, source, texture, flipH, flipV, x, y, usesPalette);
                }
            }
        }
    }

    private definePalettes(palettes: { [index: string]: IAssetPalette }): void
    {
        if(!palettes) return;

        for(let name in palettes)
        {
            const palette = palettes[name];

            if(!palette) continue;

            const id = palette.id.toString();

            if(this._palettes.get(id)) continue;

            let colorOne    = 0xFFFFFF;
            let colorTwo    = 0xFFFFFF;

            let color = palette.color1;

            if(color && color.length > 0) colorOne = parseInt(color, 16);

            color = palette.color2;

            if(color && color.length > 0) colorTwo = parseInt(color, 16);

            this._palettes.set(id, new GraphicAssetPalette(palette.rgb, colorOne, colorTwo));
        }
    }

    private createAsset(name: string, source: string, texture: PIXI.Texture, flipH: boolean, flipV: boolean, x: number, y: number, usesPalette: boolean): boolean
    {
        if(this._assets.get(name)) return false;

        const graphicAsset = GraphicAsset.createAsset(name, source, texture, x, y, flipH, flipV, usesPalette);

        this._assets.set(name, graphicAsset);

        return true;
    }

    private replaceAsset(name: string, source: string, texture: PIXI.Texture, flipH: boolean, flipV: boolean, x: number, y: number, usesPalette: boolean): boolean
    {
        const existing = this._assets.get(name);

        if(existing)
        {
            this._assets.delete(name);

            existing.recycle();
        }

        return this.createAsset(name, source, texture, flipH, flipV, x, y, usesPalette);
    }

    public getAsset(name: string): IGraphicAsset
    {
        if(!name) return null;

        const existing = this._assets.get(name);

        if(!existing) return null;

        return existing;
    }

    public getAssetWithPalette(name: string, paletteName: string): IGraphicAsset
    {
        let saveName = (name + '@' + paletteName);

        let asset = this.getAsset(saveName);

        if(!asset)
        {
            asset = this.getAsset(name);

            if(!asset || !asset.usesPalette) return asset;

            const palette = this.getPalette(paletteName);

            if(palette)
            {
                const texture = palette.applyPalette(asset.texture);

                if(texture)
                {
                    this._paletteAssetNames.push(saveName);

                    this.createAsset(saveName, (asset.source + '@' + paletteName), texture, asset.flipH, asset.flipV, asset.x, asset.y, false);

                    asset = this.getAsset(saveName);
                }
            }
        }

        return asset;
    }

    public getPaletteNames(): string[]
    {
        return Array.from(this._palettes.keys());
    }

    public getPaletteColors(paletteName: string): number[]
    {
        const palette = this.getPalette(paletteName);

        if(palette) return [ palette.primaryColor, palette.secondaryColor ];

        return null;
    }

    public getPalette(name: string): GraphicAssetPalette
    {
        if(!name) return null;

        const existing = this._palettes.get(name);

        if(!existing) return null;

        return existing;
    }

    public addAsset(name: string, texture: PIXI.Texture, override: boolean, x: number = 0, y: number = 0, flipH: boolean = false, flipV: boolean = false): boolean
    {
        if(!name || !texture) return false;

        const existingTexture = this.getLibraryAsset(name);

        if(!existingTexture)
        {
            this._textures.set(name, texture);

            return this.createAsset(name, name, texture, flipH, flipV, x, y, false);
        }

        if(override)
        {
            existingTexture.baseTexture = texture.baseTexture;
            existingTexture.frame       = texture.frame;
            existingTexture.trim        = texture.trim;

            existingTexture.updateUvs();

            return true;
        }

        return false;
    }

    public disposeAsset(name: string): void
    {
        const existing = this._assets.get(name);

        if(!existing) return;

        this._assets.delete(name);

        const texture = this.getLibraryAsset(existing.source);

        if(texture)
        {
            this._textures.delete(existing.source);

            texture.destroy();
        }

        existing.recycle();
    }

    public getLibraryAsset(name: string): PIXI.Texture
    {
        if(!name) return null;

        name = this._name + '_' + name;

        const texture = this._textures.get(name);

        if(!texture) return null;

        return texture;
    }

    private addLibraryAsset(textures: PIXI.Texture[]): void
    {
        if(!textures) return;

        for(let name in textures)
        {
            const texture = textures[name];

            if(!texture) continue;

            name = AssetManager.removeFileExtension(name);

            this._textures.set(name, texture);
        }
    }

    private disposePaletteAssets(disposeAll: boolean = true): void
    {
        if(this._paletteAssetNames)
        {
            if(disposeAll || (this._paletteAssetNames.length > GraphicAssetCollection.PALETTE_ASSET_DISPOSE_THRESHOLD))
            {
                for(let name of this._paletteAssetNames) this.disposeAsset(name);

                this._paletteAssetNames = [];
            }
        }
    }

    public get referenceCount(): number
    {
        return this._referenceCount;
    }

    public get referenceTimestamp(): number
    {
        return this._referenceTimestamp;
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