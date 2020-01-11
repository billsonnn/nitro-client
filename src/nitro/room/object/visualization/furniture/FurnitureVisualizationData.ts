import { IAsset, IAssetData } from '../../../../../core/asset/interfaces';
import { IAssetVisualizationData } from '../../../../../core/asset/interfaces/visualization';
import { Disposable } from '../../../../../core/common/disposable/Disposable';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { Direction } from '../../../../../room/utils/Direction';
import { ColorData } from '../data/ColorData';
import { LayerData } from '../data/LayerData';
import { SizeData } from '../data/SizeData';

export class FurnitureVisualizationData extends Disposable implements IObjectVisualizationData
{
    public static LAYER_LETTERS: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    protected _size: SizeData;
    
    private _type: string;
    private _allowedDirections: number[];
    private _assetData: IAssetData;

    private _tempRender: PIXI.Renderer;
    private _tempColor: number;

    constructor()
    {
        super();

        this._type              = null;
        this._size              = null;
        this._allowedDirections = [];
        this._assetData         = null;

        this._tempRender        = null;
        this._tempColor         = 0;
    }

    public initialize(asset: IAssetData): boolean
    {
        if(!asset || !asset.type) return false;

        this._type = asset.name;

        this.processDirections(asset.directions);

        if(!this.processVisualization(asset.visualization))
        {
            this.reset();

            return false;
        }

        this._assetData = asset;

        return true;
    }

    public onDispose(): void
    {
        if(this._size) this._size.dispose();

        this._size              = null;
        this._allowedDirections = [];
        this._assetData         = null;

        if(this._tempRender)
        {
            this._tempRender.destroy();

            this._tempRender = null;
        }

        super.onDispose();
    }

    public getAsset(name: string): IAsset
    {
        if(!this._assetData) return null;
        
        const existing = this._assetData.assets[name];

        if(!existing) return null;

        return existing;
    }

    private reset(): void
    {
        if(this._size) this._size.dispose();

        this._size      = null;
        this._assetData = null;
    }

    protected createSizeData(layerCount: number, angle: number): SizeData
    {
        return new SizeData(layerCount, angle);
    }

    private processDirections(directions: number[]): void
    {
        if(!directions) return;

        const totalDirections = directions.length;

        if(!totalDirections) return;

        for(let i = 0; i < totalDirections; i++) this._allowedDirections.push(Direction.angleToDirection(directions[i]));
    }

    protected processVisualization(visualization: IAssetVisualizationData): boolean
    {
        if(!visualization) return false;

        const layerCount    = visualization.layerCount;
        const angle         = visualization.angle;
        const sizeData      = this.createSizeData(layerCount, angle);

        if(!sizeData) return false;

        for(let key in visualization)
        {
            //@ts-ignore
            const data = visualization[key];
            
            if(!this.processVisualElement(sizeData, key, data))
            {
                sizeData.dispose();

                return false;
            }
        }

        this._size = sizeData;

        return true;
    }

    protected processVisualElement(sizeData: SizeData, key: string, data: any): boolean
    {
        if(!sizeData || !key || !data) return false;

        switch(key)
        {
            case 'layers':
                if(!sizeData.processLayers(data)) return false;
                break;
            case 'directions':
                if(!sizeData.processDirections(data)) return false;
                break;
            case 'colors':
                if(!sizeData.processColors(data)) return false;
                break;
            case 'iconColors':
                if(!sizeData.processIconColors(data)) return false;
                break;
        }

        return true;
    }

    public getValidDirection(direction: number): number
    {
        const index = this._allowedDirections.indexOf(direction);

        if(index === -1) return this._allowedDirections[0] || 0;

        return this._allowedDirections[index];
    }

    public getLayerTag(direction: number, layerId: number): string
    {
        if(!this._size) return LayerData.DEFAULT_TAG;

        return this._size.getLayerTag(direction, layerId);
    }

    public getLayerInk(direction: number, layerId: number): number
    {
        if(!this._size) return LayerData.DEFAULT_INK;

        return this._size.getLayerInk(direction, layerId);
    }

    public getLayerAlpha(direction: number, layerId: number): number
    {
        if(!this._size) return LayerData.DEFAULT_ALPHA;

        return this._size.getLayerAlpha(direction, layerId);
    }

    public getLayerColor(colorId: number, layerId: number): number
    {
        if(!this._size) return ColorData.DEFAULT_COLOR;

        return this._size.getLayerColor(colorId, layerId);
    }

    public getLayerIconColor(colorId: number, layerId: number): number
    {
        if(!this._size) return ColorData.DEFAULT_COLOR;

        return this._size.getLayerIconColor(colorId, layerId);
    }

    public getLayerIgnoreMouse(direction: number, layerId: number): boolean
    {
        if(!this._size) return LayerData.DEFAULT_IGNORE_MOUSE;

        return this._size.getLayerIgnoreMouse(direction, layerId);
    }

    public getLayerXOffset(direction: number, layerId: number): number
    {
        if(!this._size) return LayerData.DEFAULT_XOFFSET;

        return this._size.getLayerXOffset(direction, layerId);
    }

    public getLayerYOffset(direction: number, layerId: number): number
    {
        if(!this._size) return LayerData.DEFAULT_YOFFSET;

        return this._size.getLayerYOffset(direction, layerId);
    }

    public getLayerZOffset(direction: number, layerId: number): number
    {
        if(!this._size) return LayerData.DEFAULT_ZOFFSET;

        return this._size.getLayerZOffset(direction, layerId);
    }

    public getAssetName(direction: number, layerId: number): string
    {
        let layerCode = FurnitureVisualizationData.LAYER_LETTERS[layerId] || '';

        if(layerCode === '') return null;

        return `${ this._type }_64_${ layerCode }_${ direction }_`;
    }

    public getAssetSourceName(assetName: string, asset: IAsset): string
    {
        if(!assetName || !asset) return null;

        let source = assetName;
            
        if(asset.source) source = asset.source;

        source = `${ this._type }_${ source }.png`;

        return source;
    }

    public renderFurniture(direction: number, colorId: number): PIXI.Renderer
    {
        if(this._tempRender)
        {
            if(this._tempColor === colorId) return this._tempRender;

            this._tempRender.destroy();

            this._tempRender = null;
        }

        this._tempRender = PIXI.autoDetectRenderer({
            clearBeforeRender: false,
            transparent: true
        });

        this._tempColor = colorId;

        let left    = 0;
        let right   = 0;
        let top     = 0;
        let bottom  = 0;

        const sprites: PIXI.Sprite[] = [];

        for(let layerId = 0; layerId < this.layerCount; layerId++)
        {
            const assetName = this.getAssetName(direction, layerId) + '0';
            const assetData = this.getAsset(assetName);

            if(!assetData) continue;

            const sprite = PIXI.Sprite.from(this.getAssetSourceName(assetName, assetData));

            if(assetData.flipH) sprite.scale.x = -1;

            sprite.x        = -assetData.x;
            sprite.y        = -assetData.y;

            if(assetData.flipH) sprite.x *= -1;

            sprite.blendMode    = this.getLayerInk(direction, layerId);
            sprite.alpha        = this.getLayerAlpha(direction, layerId);
            sprite.tint         = this.getLayerColor(colorId, layerId);
            sprite.x            = (sprite.x + this.getLayerXOffset(direction, layerId));
            sprite.y            = (sprite.y + this.getLayerYOffset(direction, layerId));

            if(layerId === 0)
            {
                top     = sprite.y + sprite.height;
                bottom  = sprite.y;
                left    = sprite.x;
                right   = sprite.x + sprite.width;
            }
            else
            {
                if(sprite.x < left) left = sprite.x;
                if((sprite.x + sprite.width) > right) right = sprite.x + sprite.width;
                if((sprite.y + sprite.height) > top) top = sprite.y + sprite.height;
                if(sprite.y < bottom) bottom = sprite.y;
            }

            sprites.push(sprite);
        }

        const width     = Math.abs(left - right);
        const height    = Math.abs(top - bottom);

        this._tempRender.resize(width, height);

        for(let sprite of sprites)
        {
            if(!sprite) continue;

            if(left < 0)
            {
                sprite.x += Math.abs(left);
            }

            if(bottom < 0)
            {
                sprite.y += Math.abs(bottom);
            }

            this._tempRender.render(sprite);
        }

        return this._tempRender;
    }

    public get type(): string
    {
        return this._type;
    }

    public get sizeData(): SizeData
    {
        return this._size;
    }

    public get assetData(): IAssetData
    {
        return this._assetData;
    }

    public get layerCount(): number
    {
        return (this._size && this._size.layerCount) || 0;
    }

    public get saveable(): boolean
    {
        return true;
    }
}