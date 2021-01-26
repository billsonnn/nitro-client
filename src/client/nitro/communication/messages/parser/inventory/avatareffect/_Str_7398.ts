import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';

export class _Str_7398 implements IMessageParser
{
    private _type: number;
    private _Str_4653: number;
    private _duration: number;
    private _Str_5145: boolean;

    public flush(): boolean
    {
        this._type      = 0;
        this._Str_4653  = 0;
        this._duration  = 0;
        this._Str_5145  = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._type      = wrapper.readInt();
        this._Str_4653  = wrapper.readInt();
        this._duration  = wrapper.readInt();
        this._Str_5145  = wrapper.readBoolean();

        return true;
    }

    public get type(): number
    {
        return this._type;
    }

    public get _Str_3882(): number
    {
        return this._Str_4653;
    }

    public get duration(): number
    {
        return this._duration;
    }

    public get _Str_4010(): boolean
    {
        return this._Str_5145;
    }
}