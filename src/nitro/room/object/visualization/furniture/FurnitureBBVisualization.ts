import { RoomObjectVisualizationType } from '../../RoomObjectVisualizationType';
import { FurnitureBrandedImageVisualization } from './FurnitureBrandedImageVisualization';

export class FurnitureBBVisualization extends FurnitureBrandedImageVisualization
{
    public static TYPE: string = RoomObjectVisualizationType.FURNITURE_BB;

    protected getLayerXOffset(scale: number, direction: number, layerId: number): number
    {
        return super.getLayerXOffset(scale, direction, layerId) + this._offsetX;
    }

    protected getLayerYOffset(scale: number, direction: number, layerId: number): number
    {
        return super.getLayerYOffset(scale, direction, layerId) + this._offsetY;
    }

    protected getLayerZOffset(scale: number, direction: number, layerId: number): number
    {
        return super.getLayerZOffset(scale, direction, layerId) + this._offsetZ;
    }
}