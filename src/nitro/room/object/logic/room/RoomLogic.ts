import { RoomObjectLogicBase } from '../../../../../room/object/logic/RoomObjectLogicBase';
import { RoomMapData } from '../../RoomMapData';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { RoomPlaneParser } from '../../RoomPlaneParser';

export class RoomLogic extends RoomObjectLogicBase
{
    private _planeParser: RoomPlaneParser;

    constructor()
    {
        super();

        this._planeParser = new RoomPlaneParser();
    }

    public dispose(): void
    {
        super.dispose();

        if(this._planeParser)
        {
            this._planeParser.dispose();

            this._planeParser = null;
        }
    }

    public initialize(roomMap: RoomMapData): void
    {
        if(!roomMap || !this.object) return;

        //if(!this._planeParser._Str_16659(roomMap)) validate

        this.object.model.setValue(RoomObjectModelKey.ROOM_BACKGROUND_COLOR, 0xFFFFFF);
        this.object.model.setValue(RoomObjectModelKey.ROOM_FLOOR_VISIBILITY, 1);
        this.object.model.setValue(RoomObjectModelKey.ROOM_WALL_VISIBILITY, 1);
        this.object.model.setValue(RoomObjectModelKey.ROOM_LANDSCAPE_VISIBILITY, 1);
    }
}