import { RoomObjectVisualizationType } from '../../RoomObjectVisualizationType';
import { DirectionalOffsetData } from '../data/DirectionalOffsetData';
import { FurnitureBrandedImageVisualization } from './FurnitureBrandedImageVisualization';

export class FurnitureRoomBackgroundVisualization extends FurnitureBrandedImageVisualization
{
    public static TYPE: string = RoomObjectVisualizationType.FURNITURE_BG;

    private _imageOffset: DirectionalOffsetData;

    protected imageReady(texture: PIXI.Texture, imageUrl: string): void
    {
        super.imageReady(texture, imageUrl);

        if(!texture) return;

        this.setImageOffset(texture.width, texture.height);
    }

    private setImageOffset(width: number, height: number): void
    {
        const offsetData = new DirectionalOffsetData();

        offsetData.setDirection(1, 0, -height);
        offsetData.setDirection(3, 0, 0);
        offsetData.setDirection(5, -width, 0);
        offsetData.setDirection(7, -width, -height);
        offsetData.setDirection(4, (-width / 2), (-height / 2));

        this._imageOffset = offsetData;
    }

    protected getLayerXOffset(direction: number, layerId: number): number
    {
        if(this._imageOffset)
        {
            const offset = this._imageOffset.getXOffset(direction, 0);

            if(offset !== undefined) return offset + this._offsetX;
        }

        return super.getLayerXOffset(direction, layerId) + this._offsetX;
    }

    protected getLayerYOffset(direction: number, layerId: number): number
    {
        if(this._imageOffset)
        {
            const offset = this._imageOffset.getYOffset(direction, 0);

            if(offset !== undefined) return offset + this._offsetY;
        }

        return super.getLayerYOffset(direction, layerId) + this._offsetY;
    }

    protected getLayerZOffset(direction: number, layerId: number): number
    {
        return super.getLayerZOffset(direction, layerId) + (this._offsetZ * -1);
    }
}