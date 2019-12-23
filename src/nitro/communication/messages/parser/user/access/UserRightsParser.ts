import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';

export class UserRightsParser implements IMessageParser
{
    private _flag1: boolean;
    private _flag2: boolean;
    private _flag3: boolean;

    public flush(): boolean
    {
        this._flag1 = false;
        this._flag2 = false;
        this._flag3 = false

        return true;
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._flag1 = wrapper.readBoolean();
        this._flag2 = wrapper.readBoolean();
        this._flag3 = wrapper.readBoolean();

        return true;
    }

    public get flag1(): boolean
    {
        return this._flag1;
    }

    public get flag2(): boolean
    {
        return this._flag2;
    }

    public get flag3(): boolean
    {
        return this._flag3;
    }
}