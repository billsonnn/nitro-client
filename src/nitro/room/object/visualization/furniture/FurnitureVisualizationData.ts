import { IAsset, IAssetData } from '../../../../../core/asset/interfaces';
import { IAssetVisualizationData } from '../../../../../core/asset/interfaces/visualization';
import { Disposable } from '../../../../../core/common/disposable/Disposable';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
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

    constructor()
    {
        super();

        this._type              = null;
        this._size              = null;
        this._allowedDirections = [];
        this._assetData         = null;
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

        for(let i = 0; i < totalDirections; i++) this._allowedDirections.push(directions[i]);
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
        if(!this._size) return 0;

        return this._size.getValidDirection(direction);
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