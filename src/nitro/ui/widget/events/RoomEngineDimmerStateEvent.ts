import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomEngineDimmerStateEvent extends RoomWidgetUpdateEvent
{
    public static RWDSUE_DIMMER_STATE: string = 'RWDSUE_DIMMER_STATE';

    private _state: number;
    private _Str_6356: number;
    private _Str_3770: number;
    private _color: number;
    private _Str_3486: number;

    constructor(k: number, _arg_2: number, _arg_3: number, _arg_4: number, _arg_5: number)
    {
        super(RoomEngineDimmerStateEvent.RWDSUE_DIMMER_STATE);
        
        this._state = k;
        this._Str_6356 = _arg_2;
        this._Str_3770 = _arg_3;
        this._color = _arg_4;
        this._Str_3486 = _arg_5;
    }

    public get state(): number
    {
        return this._state;
    }

    public get _Str_14686(): number
    {
        return this._Str_6356;
    }

    public get _Str_6815(): number
    {
        return this._Str_3770;
    }

    public get color(): number
    {
        return this._color;
    }

    public get _Str_5123(): number
    {
        return this._Str_3486;
    }
}