import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { _Str_3013 } from './_Str_3013';

export class _Str_6995 implements IMessageParser
{
    private _item: _Str_3013;
    private _Str_12302: boolean;

    public flush(): boolean
    {
        this._item      = null;
        this._Str_12302 = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._item      = new _Str_3013(wrapper);
        this._Str_12302 = wrapper.readBoolean();

        return true;
    }

    public get item(): _Str_3013
    {
        return this._item;
    }

    public _Str_19947(): boolean
    {
        return this._Str_12302;
    }
}