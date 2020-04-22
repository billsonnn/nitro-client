import { RoomObjectVariable } from '../../RoomObjectVariable';
import { RoomObjectVisualizationType } from '../../RoomObjectVisualizationType';
import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';

export class FurnitureGuildCustomizedVisualization extends FurnitureAnimatedVisualization
{
    public static TYPE: string = RoomObjectVisualizationType.FURNITURE_GUILD_CUSTOMIZED;

    public static DEFAULT_COLOR_1: number    = 0xEEEEEE;
    public static DEFAULT_COLOR_2: number    = 0x4B4B4B;

    private _color1: number;
    private _color2: number;

    constructor()
    {
        super();

        this._color1    = FurnitureGuildCustomizedVisualization.DEFAULT_COLOR_1;
        this._color2    = FurnitureGuildCustomizedVisualization.DEFAULT_COLOR_2;
    }

    protected updateModel(scale: number): boolean
    {
        const flag = super.updateModel(scale);

        if(!flag) return false;

        this._color1 = this.object.model.getValue(RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_COLOR_1) as number;
        this._color2 = this.object.model.getValue(RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_COLOR_2) as number;

        return flag;
    }

    protected getLayerColor(scale: number, layerId: number, colorId: number): number
    {
        const tag = this.getLayerTag(scale, this._direction, layerId);

        switch(tag)
        {
            case 'COLOR1': return this._color1;
            case 'COLOR2': return this._color2;
        }

        return super.getLayerColor(scale, layerId, colorId);
    }
}