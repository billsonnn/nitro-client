import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { _Str_5478 } from '../../../incoming/room/furniture/_Str_5478';

export class RoomDimmerPresetsMessageParser implements IMessageParser
{
    private _selectedPresetId: number = 0;
    private _presets: _Str_5478[];

    constructor()
    {
        this._presets = [];
    }

    public get _Str_10888(): number
    {
        return this._presets.length;
    }

    public get _Str_6226(): number
    {
        return this._selectedPresetId;
    }

    public _Str_14989(k: number): _Str_5478
    {
        if((k < 0) || (k >= this._Str_10888)) return null;

        return this._presets[k];
    }

    public flush(): boolean
    {
        this._presets = [];

        return true;
    }

    public parse(k: IMessageDataWrapper): boolean
    {
        const totalPresets = k.readInt();
        
        this._selectedPresetId = k.readInt();

        let _local_3 = 0;

        while (_local_3 < totalPresets)
        {
            const _local_4 = k.readInt();
            const _local_5 = k.readInt();
            const _local_6 = k.readString();
            const _local_7 = parseInt(_local_6.substr(1), 16);
            const _local_8 = k.readInt();
            
            const _local_9 = new _Str_5478(_local_4);

            _local_9.type       = _local_5;
            _local_9.color      = _local_7;
            _local_9._Str_4272  = _local_8;

            _local_9._Str_4710();

            this._presets.push(_local_9);

            _local_3++;
        }

        return true;
    }
}