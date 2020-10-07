import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';

export class _Str_9589 implements IMessageParser
{
    private _Str_8107: number;
    private _Str_16372: boolean;
    private _Str_17246: number;
    private _Str_8945: boolean;

    public flush(): boolean
    {
        this._Str_8107  = -1;
        this._Str_16372 = false;
        this._Str_17246 = -1;
        this._Str_8945  = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;
        
        this._Str_8107  = wrapper.readInt();
        this._Str_16372 = (wrapper.readInt() === 1);
        this._Str_17246 = wrapper.readInt();
        this._Str_8945  = (wrapper.readInt() === 1);

        return true;
    }

    public get _Str_4963(): number
    {
        return this._Str_8107;
    }

    public get _Str_16764(): boolean
    {
        return this._Str_16372;
    }

    public get _Str_17613(): number
    {
        return this._Str_17246;
    }

    public get _Str_13374(): boolean
    {
        return this._Str_8945;
    }
}