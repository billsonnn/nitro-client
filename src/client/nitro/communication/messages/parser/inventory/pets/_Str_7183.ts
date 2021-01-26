import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';

export class _Str_7183 implements IMessageParser
{
    private _Str_2388: number;


    public flush(): boolean
    {
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._Str_2388 = wrapper.readInt();

        return true;
    }

    public get _Str_2508(): number
    {
        return this._Str_2388;
    }
}