﻿import { RoomObjectMouseEvent } from '../../../room/events/RoomObjectMouseEvent';
import { IRoomObject } from '../../../room/object/IRoomObject';

export class RoomObjectTileMouseEvent extends RoomObjectMouseEvent 
{
    private _tileX: number;
    private _tileY: number;
    private _tileZ: number;

    constructor(type: string, object: IRoomObject, eventId: string, tileX: number, tileY: number, tileZ: number, altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false, buttonDown: boolean = false)
    {
        super(type, object, eventId, altKey, ctrlKey, shiftKey, buttonDown);

        this._tileX = tileX;
        this._tileY = tileY;
        this._tileZ = tileZ;
    }

    public get tileX(): number
    {
        return this._tileX;
    }

    public get tileY(): number
    {
        return this._tileY;
    }

    public get tileZ(): number
    {
        return this._tileZ;
    }

    public get _Str_16836(): number
    {
        return Math.trunc(this._tileX + 0.499);
    }

    public get _Str_17676(): number
    {
        return Math.trunc(this._tileY + 0.499);
    }

    public get _Str_21459(): number
    {
        return Math.trunc(this._tileZ + 0.499);
    }
}