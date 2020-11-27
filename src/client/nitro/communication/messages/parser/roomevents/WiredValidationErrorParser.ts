import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../core/communication/messages/IMessageParser';

export class WiredValidationErrorParser implements IMessageParser
{
    private _info: string;

    public flush(): boolean
    {
        this._info = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._info = wrapper.readString();

        return true;
    }

    public get info(): string
    {
        return this._info;
    }
}