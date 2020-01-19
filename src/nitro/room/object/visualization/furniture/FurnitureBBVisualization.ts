import { ObjectVisualizationType } from '../ObjectVisualizationType';
import { FurnitureBrandedImageVisualization } from './FurnitureBrandedImageVisualization';

export class FurnitureBBVisualization extends FurnitureBrandedImageVisualization
{
    public static TYPE: string = ObjectVisualizationType.FURNITURE_BB;

    protected getLayerXOffset(direction: number, layerId: number): number
    {
        return super.getLayerXOffset(direction, layerId) + this._offsetX;
    }

    protected getLayerYOffset(direction: number, layerId: number): number
    {
        return super.getLayerYOffset(direction, layerId) + this._offsetY;
    }

    protected getLayerZOffset(direction: number, layerId: number): number
    {
        return super.getLayerZOffset(direction, layerId) + this._offsetZ;
    }
}