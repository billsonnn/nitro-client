import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../core/communication/messages/IMessageParser';

export class BotErrorEventParser implements IMessageParser
{
    private _errorCode: number;

    public flush(): boolean
    {
        this._errorCode = -1;
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._errorCode = wrapper.readInt();

        return true;
    }

    public get errorCode(): number
    {
        return this._errorCode;
    }
}
