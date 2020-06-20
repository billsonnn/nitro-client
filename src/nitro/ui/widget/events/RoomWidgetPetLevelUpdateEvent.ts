import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetPetLevelUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWPLUE_PET_LEVEL_UPDATE: string = 'RWPLUE_PET_LEVEL_UPDATE';

    private _Str_2388: number;
    private _level: number;

    constructor(k: number, _arg_2: number)
    {
        super(RoomWidgetPetLevelUpdateEvent.RWPLUE_PET_LEVEL_UPDATE);
        
        this._Str_2388 = k;
        this._level = _arg_2;
    }

    public get _Str_2508(): number
    {
        return this._Str_2388;
    }

    public get level(): number
    {
        return this._level;
    }
}