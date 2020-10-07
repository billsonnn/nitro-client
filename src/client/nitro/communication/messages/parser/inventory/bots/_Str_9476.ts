import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { _Str_3013 } from './_Str_3013';

export class _Str_9476 implements IMessageParser
{
    private _Str_10056: boolean;
    private _item: _Str_3013;

    public flush(): boolean
    {
        this._Str_10056 = false;
        this._item      = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._Str_10056 = wrapper.readBoolean();
        this._item      = new _Str_3013(wrapper);

        return true;
    }

    public get _Str_20732(): boolean
    {
        return this._Str_10056;
    }

    public get item(): _Str_3013
    {
        return this._item;
    }
}