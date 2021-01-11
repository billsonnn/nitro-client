import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { _Str_2848 } from './_Str_2848';

export class _Str_8182 implements IMessageParser
{
    private _pet: _Str_2848;
    private _Str_12302: boolean;

    public flush(): boolean
    {
        this._pet = null;
        return true;
    }

    public parse(k: IMessageDataWrapper): boolean
    {
        this._pet       = new _Str_2848(k);
        this._Str_12302 = k.readBoolean();

        return true;
    }

    public get pet(): _Str_2848
    {
        return this._pet;
    }

    public _Str_19947(): boolean
    {
        return this._Str_12302;
    }
}