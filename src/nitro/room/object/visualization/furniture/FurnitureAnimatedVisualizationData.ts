import { AnimationFrame } from '../data/AnimationFrame';
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
                if(!(sizeData instanceof AnimationSizeData) || !sizeData.defineAnimations(data)) return false;
                break;
            default:
                if(!super.processVisualElement(sizeData, key, data)) return false;
                break;
        }

        return true;
    }

    public hasAnimation(animationId: number): boolean
    {
        if(!this._size) return false;
        
        return this._size.hasAnimation(animationId);
    }

    public getAnimationCount(): number
    {
        if(!this._size) return 0;
        
        return this._size.getAnimationCount();
    }

    public getAnimationId(animationId: number): number
    {
        if(!this._size) return 0;
        
        return this._size.getAnimationId(animationId);
    }

    public isImmediateChange(animationId: number, _arg_3: number): boolean
    {
        if(!this._size) return false;
        
        return this._size.isImmediateChange(animationId, _arg_3);
    }

    public getStartFrame(animationId: number, direction: number): number
    {
        if(!this._size) return 0;
        
        return this._size.getStartFrame(animationId, direction);
    }

    public getFrame(animationId: number, direction: number, layerId: number, frameCount: number): AnimationFrame
    {
        if(!this._size) return null;
        
        return this._size.getFrame(animationId, direction, layerId, frameCount);
    }

    public getFrameFromSequence(animationId: number, direction: number, layerId: number, sequenceId: number, offset: number, frameCount: number):AnimationFrame
    {
        if(!this._size) return null;
        
        return this._size.getFrameFromSequence(animationId, direction, layerId, sequenceId, offset, frameCount);
    }
}