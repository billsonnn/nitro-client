import { RoomMapData } from '../object/RoomMapData';

export class RoomData 
{
    private _roomId: number;
    private _data: RoomMapData;
    private _floorType: string;
    private _wallType: string;
    private _landscapeType: string;

    constructor(roomId: number, data: RoomMapData)
    {
        this._roomId        = roomId;
        this._data          = data;
        this._floorType     = null;
        this._wallType      = null;
        this._landscapeType = null;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public get data(): RoomMapData
    {
        return this._data;
    }

    public get _Str_5207(): string
    {
        return this._floorType;
    }

    public set _Str_5207(k: string)
    {
        this._floorType = k;
    }

    public get _Str_5259(): string
    {
        return this._wallType;
    }

    public set _Str_5259(k: string)
    {
        this._wallType = k;
    }

    public get _Str_5109(): string
    {
        return this._landscapeType;
    }

    public set _Str_5109(k: string)
    {
        this._landscapeType = k;
    }
}