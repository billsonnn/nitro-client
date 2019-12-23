import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { RoomObjectSpriteVisualization } from '../../../../../room/object/visualization/RoomObjectSpriteVisualization';
import { RoomVisualizationData } from './RoomVisualizationData';

export class RoomVisualization extends RoomObjectSpriteVisualization
{
    protected _data: RoomVisualizationData;

    constructor()
    {
        super();

        //this._isSelfContained = true;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        if(!(data instanceof RoomVisualizationData)) return false;
        
        this._data  = data;

        super.initialize(data);

        return true;
    }
}