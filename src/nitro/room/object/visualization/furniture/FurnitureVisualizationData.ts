import { IAssetData } from '../../../../../core/asset/interfaces';
import { IAssetVisualizationData } from '../../../../../core/asset/interfaces/visualization';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { ColorData } from '../data/ColorData';
import { LayerData } from '../data/LayerData';
import { SizeData } from '../data/SizeData';

export class FurnitureVisualizationData implements IObjectVisualizationData
{
    public static LAYER_LETTERS: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    private _type: string;
    private _sizes: number[];
    private _sizeDatas: Map<number, SizeData>;
    private _lastSize: number;
    private _lastSizeScale: number;
    private _lastSizeData: SizeData;
    private _lastSizeDataScale: number;

    constructor()
    {
        this._type              = '';
        this._sizes             = [];
        this._sizeDatas         = new Map();
        this._lastSize          = -1;
        this._lastSizeScale     = -1;
        this._lastSizeData      = null;
        this._lastSizeDataScale = -1;
    }

    public initialize(asset: IAssetData): boolean
    {
        this.reset();

        if(!asset || (!asset.type || !asset.type.length)) return false;

        this._type = asset.name;

        if(!this.processVisualization(asset.visualization))
        {
            this.reset();

            return false;
        }

        return true;
    }

    public dispose(): void
    {
        if(this._sizeDatas && this._sizeDatas.size)
        {
            for(let size of this._sizeDatas.values()) size && size.dispose();

            this._sizeDatas = null;
        }

        this._lastSizeData  = null;
        this._sizes         = null;
    }

    private reset(): void
    {
        this._type = '';

        if(this._sizeDatas && this._sizeDatas.size)
        {
            for(let size of this._sizeDatas.values()) size && size.dispose();
        }

        this._sizeDatas.clear();

        this._sizes             = [];
        this._lastSizeData      = null;
        this._lastSizeDataScale = -1;
    }

    protected createSizeData(scale: number, layerCount: number, angle: number): SizeData
    {
        return new SizeData(layerCount, angle);
    }

    protected processVisualization(visualization: IAssetVisualizationData): boolean
    {
        if(!visualization) return false;

        let scale = 64;

        const layerCount    = visualization.layerCount;
        const angle         = visualization.angle;

        if(scale < 1) scale = 1;

        if(this._sizeDatas.get(scale)) return false;

        const sizeData = this.createSizeData(scale, layerCount, angle);

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

        this._sizeDatas.set(scale, sizeData);

        this._sizes.push(scale);

        this._sizes.sort();

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

    public getValidSize(scale: number): number
    {
        if(scale === this._lastSizeScale) return this._lastSize;

        const sizeIndex = this.getSizeIndex(scale);

        let newScale = -1;

        if(sizeIndex < this._sizes.length) newScale = this._sizes[sizeIndex];

        this._lastSizeScale = scale;
        this._lastSize      = newScale;

        return newScale;
    }

    private getSizeIndex(size: number): number
    {
        if(size <= 0) return 0;

        let index       = 0;
        let iterator   = 1;

        while(iterator < this._sizes.length)
        {
            if(this._sizes[iterator] > size)
            {
                if((this._sizes[iterator] / size) < (size / this._sizes[(iterator - 1)])) index = iterator;

                break;
            }

            index = iterator;

            iterator++;
        }

        return index;
    }

    protected getSizeData(size: number): SizeData
    {
        if(size === this._lastSizeDataScale) return this._lastSizeData;

        const sizeIndex = this.getSizeIndex(size);

        if(sizeIndex < this._sizes.length) this._lastSizeData = this._sizeDatas.get(this._sizes[sizeIndex]);
        else this._lastSizeData = null;

        this._lastSizeDataScale = size;

        return this._lastSizeData;
    }

    public getLayerCount(scale: number): number
    {
        const size = this.getSizeData(scale);

        if(!size) return LayerData.DEFAULT_COUNT;

        return size.layerCount;
    }

    public getValidDirection(scale: number, direction: number): number
    {
        const size = this.getSizeData(scale);

        if(!size) return LayerData.DEFAULT_DIRECTION;

        return size.getValidDirection(direction);
    }

    public getLayerTag(scale: number, direction: number, layerId: number): string
    {
        const size = this.getSizeData(scale);

        if(!size) return LayerData.DEFAULT_TAG;

        return size.getLayerTag(direction, layerId);
    }

    public getLayerInk(scale: number, direction: number, layerId: number): number
    {
        const size = this.getSizeData(scale);

        if(!size) return LayerData.DEFAULT_INK;

        return size.getLayerInk(direction, layerId);
    }

    public getLayerAlpha(scale: number, direction: number, layerId: number): number
    {
        const size = this.getSizeData(scale);

        if(!size) return LayerData.DEFAULT_ALPHA;

        return size.getLayerAlpha(direction, layerId);
    }
    
    public getLayerColor(scale: number, layerId: number, colorId: number): number
    {
        const size = this.getSizeData(scale);

        if(!size) return ColorData.DEFAULT_COLOR;

        return size.getLayerColor(layerId, colorId);
    }

    public getLayerIconColor(scale: number, colorId: number, layerId: number): number
    {
        const size = this.getSizeData(scale);

        if(!size) return ColorData.DEFAULT_COLOR;

        return size.getLayerIconColor(colorId, layerId);
    }

    public getLayerIgnoreMouse(scale: number, direction: number, layerId: number): boolean
    {
        const size = this.getSizeData(scale);

        if(size) return LayerData.DEFAULT_IGNORE_MOUSE;

        return size.getLayerIgnoreMouse(direction, layerId);
    }

    public getLayerXOffset(scale: number, direction: number, layerId: number): number
    {
        const size = this.getSizeData(scale);

        if(!size) return LayerData.DEFAULT_XOFFSET;

        return size.getLayerXOffset(direction, layerId);
    }

    public getLayerYOffset(scale: number, direction: number, layerId: number): number
    {
        const size = this.getSizeData(scale);

        if(!size) return LayerData.DEFAULT_YOFFSET;

        return size.getLayerYOffset(direction, layerId);
    }

    public getLayerZOffset(scale: number, direction: number, layerId: number): number
    {
        const size = this.getSizeData(scale);

        if(!size) return LayerData.DEFAULT_ZOFFSET;

        return size.getLayerZOffset(direction, layerId);
    }

    public get type(): string
    {
        return this._type;
    }
}