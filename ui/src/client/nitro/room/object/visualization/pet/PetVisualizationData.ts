import { IAssetVisualizationData } from '../../../../../core/asset/interfaces';
import { AnimationSizeData } from '../data/AnimationSizeData';
import { PetSizeData } from '../data/PetSizeData';
import { SizeData } from '../data/SizeData';
import { FurnitureAnimatedVisualizationData } from '../furniture/FurnitureAnimatedVisualizationData';

export class PetVisualizationData extends FurnitureAnimatedVisualizationData
{
    private _isAllowedToTurnHead: boolean;

    constructor()
    {
        super();

        this._isAllowedToTurnHead = true;
    }

    protected createSizeData(scale: number, layerCount: number, angle: number): SizeData
    {
        if(scale > 1) return new PetSizeData(layerCount, angle);
        else return new AnimationSizeData(layerCount, angle);
    }

    protected defineVisualizations(visualizations: IAssetVisualizationData[]): boolean
    {
        this._isAllowedToTurnHead = true; //check visualization for '@disableheadturn'

        return super.defineVisualizations(visualizations);
    }

    protected processVisualElement(sizeData: SizeData, key: string, data: any): boolean
    {
        if(!sizeData || !key || !data) return false;

        switch(key)
        {
            case 'postures':
                if(!(sizeData instanceof PetSizeData) || !sizeData.processPostures(data)) return false;
                break;
            case 'gestures':
                if(!(sizeData instanceof PetSizeData) || !sizeData.processGestures(data)) return false;
                break;
            default:
                if(!super.processVisualElement(sizeData, key, data)) return false;
                break;
        }

        return true;
    }

    public postureToAnimation(scale: number, posture: string): number
    {
        const size = this.getSizeData(scale) as PetSizeData;

        if(!size) return PetSizeData.DEFAULT;

        return size.postureToAnimation(posture);
    }

    public _Str_18284(scale: number, posture: string): boolean
    {
        const size = this.getSizeData(scale) as PetSizeData;

        if(!size) return false;

        return size._Str_18284(posture);
    }

    public gestureToAnimation(scale: number, gesture: string): number
    {
        const size = this.getSizeData(scale) as PetSizeData;

        if(!size) return PetSizeData.DEFAULT;

        return size.gestureToAnimation(gesture);
    }

    public _Str_14207(scale: number, index: number, useDefault: boolean): string
    {
        const size = this.getSizeData(scale) as PetSizeData;

        if(!size) return null;

        return size._Str_14207(index, useDefault);
    }

    public _Str_17844(scale: number, index: number): string
    {
        const size = this.getSizeData(scale) as PetSizeData;

        if(!size) return null;

        return size._Str_17844(index);
    }

    public _Str_17976(scale: number, _arg_2: number): string
    {
        const size = this.getSizeData(scale) as PetSizeData;

        if(!size) return null;

        return size._Str_17976(_arg_2);
    }

    public totalPostures(scale: number): number
    {
        const size = this.getSizeData(scale) as PetSizeData;

        if(!size) return 0;

        return size.totalPostures;
    }

    public totalGestures(scale: number): number
    {
        const size = this.getSizeData(scale) as PetSizeData;

        if(!size) return 0;

        return size.totalGestures;
    }

    public get isAllowedToTurnHead(): boolean
    {
        return this._isAllowedToTurnHead;
    }
}