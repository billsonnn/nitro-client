import { RoomObjectUpdateMessage } from '../../../room/messages/RoomObjectUpdateMessage';
import { RoomMapData } from '../object/RoomMapData';

export class ObjectRoomUpdateMapMessage extends RoomObjectUpdateMessage
{
    public static UPDATE_MODEL: string = 'RORUMM_UPDATE_MODEL';

    private _type: string;
    private _mapData: RoomMapData;

    constructor(mapData: RoomMapData)
    {
        super(null, null);

        this._type      = ObjectRoomUpdateMapMessage.UPDATE_MODEL;
        this._mapData   = mapData;
    }

    public get type(): string
    {
        return this._type;
    }

    public get mapData(): RoomMapData
    {
        return this._mapData;
    }
}
