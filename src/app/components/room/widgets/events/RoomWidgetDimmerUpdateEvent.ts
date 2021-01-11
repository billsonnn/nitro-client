import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { _Str_6094 } from './_Str_6094';

export class RoomWidgetDimmerUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWDUE_PRESETS: string = "RWDUE_PRESETS";
    public static RWDUE_HIDE: string = "RWDUE_HIDE";

    private _selectedPresetId: number = 0;
    private _presets: _Str_6094[];

    constructor(k: string)
    {
        super(k);

        this._presets = [];
    }

    public get _Str_6226(): number
    {
        return this._selectedPresetId;
    }

    public get _Str_10888(): number
    {
        return this._presets.length;
    }

    public get _Str_8447(): _Str_6094[]
    {
        return this._presets;
    }

    public set _Str_6226(k: number)
    {
        this._selectedPresetId = k;
    }

    public _Str_17287(k: number, _arg_2: number, _arg_3: number, _arg_4: number):void
    {
        var _local_5 = new _Str_6094(k, _arg_2, _arg_3, _arg_4);

        this._presets[(k - 1)] = _local_5;
    }

    public _Str_14989(k: number): _Str_6094
    {
        if (((k < 0) || (k >= this._presets.length))) return null;
        
        return this._presets[k];
    }
}