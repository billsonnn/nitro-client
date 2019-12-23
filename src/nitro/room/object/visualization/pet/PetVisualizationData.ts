import { PetSizeData } from '../data/PetSizeData';
import { SizeData } from '../data/SizeData';
import { FurnitureAnimatedVisualizationData } from '../furniture/FurnitureAnimatedVisualizationData';

export class PetVisualizationData extends FurnitureAnimatedVisualizationData
{
    protected _size: PetSizeData;

    protected createSizeData(layerCount: number, angle: number): SizeData
    {
        return new PetSizeData(layerCount, angle);
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

    public postureToAnimation(posture: string): number
    {
        if(!this._size) return PetSizeData.DEFAULT_POSTURE;

        return this._size.postureToAnimation(posture);
    }

    public totalPostures(): number
    {
        if(!this._size) return 0;

        return this._size.totalPostures;
    }

    public totalGestures(): number
    {
        if(!this._size) return 0;

        return this._size.totalPostures;
    }
}