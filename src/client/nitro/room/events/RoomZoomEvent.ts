﻿import { RoomEngineEvent } from './RoomEngineEvent';

export class RoomZoomEvent extends RoomEngineEvent 
{
    public static ROOM_ZOOM: string = 'REE_ROOM_ZOOM';

    private _level: number;
    private _percise: boolean;

    constructor(roomId: number, level: number, percise: boolean = false)
    {
        super(RoomZoomEvent.ROOM_ZOOM, roomId);

        this._level     = level;
        this._percise   = percise;
    }

    public get level(): number
    {
        return this._level;
    }

    public get percise(): boolean
    {
        return this._percise;
    }
}