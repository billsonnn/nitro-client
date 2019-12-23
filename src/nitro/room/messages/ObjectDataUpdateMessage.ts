import { RoomObjectUpdateMessage } from '../../../room/messages/RoomObjectUpdateMessage';
import { IObjectData } from '../object/data/IObjectData';

export class ObjectDataUpdateMessage extends RoomObjectUpdateMessage
{
    private _state: number;
    private _data: IObjectData;

    constructor(state: number, data: IObjectData)
    {
        super(null);

        this._state = state;
        this._data  = data;
    }

    public get state(): number
    {
        return this._state;
    }

    public get data(): IObjectData
    {
        return this._data;
    }
}