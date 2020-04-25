import { RoomObjectVisualizationType } from '../../RoomObjectVisualizationType';
import { ColorData } from '../data/ColorData';
import { FurnitureVisualization } from './FurnitureVisualization';

export class FurnitureStickieVisualization extends FurnitureVisualization
{
    public static TYPE: string = RoomObjectVisualizationType.FURNITURE_STICKIE;

    protected getLayerColor(scale: number, layerId: number, colorId: number): number
    {
        if(!this._data) return ColorData.DEFAULT_COLOR;
        
        return this._data.getLayerColor(scale, layerId, colorId);
    }
}