import { AnimationData } from '../data/AnimationData';
import { AnimationSizeData } from '../data/AnimationSizeData';
import { SizeData } from '../data/SizeData';
import { FurnitureVisualizationData } from './FurnitureVisualizationData';

export class FurnitureAnimatedVisualizationData extends FurnitureVisualizationData
{
    protected _size: AnimationSizeData;

    protected createSizeData(layerCount: number, angle: number): SizeData
    {
        return new AnimationSizeData(layerCount, angle);
    }

    protected processVisualElement(sizeData: SizeData, key: string, data: any): boolean
    {
        if(!sizeData || !key || !data) return false;

        switch(key)
        {
            case 'animations':
                if(!(sizeData instanceof AnimationSizeData) || !sizeData.processAnimations(data)) return false;
                break;
            default:
                if(!super.processVisualElement(sizeData, key, data)) return false;
                break;
        }

        return true;
    }

    public getAnimation(animationId: number): AnimationData
    {
        if(!this._size) return null;

        return this._size.getAnimation(animationId);
    }

    public hasAnimation(animationId: number): boolean
    {
        if(!this._size) return false;

        return this._size.hasAnimation(animationId);
    }
}