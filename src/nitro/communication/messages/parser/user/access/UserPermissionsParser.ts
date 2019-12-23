import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';

export class UserPermissionsParser implements IMessageParser
{
    private _clubLevel: number;
    private _rank: number;
    private _isAmbassador: boolean;

    public flush(): boolean
    {
        this._clubLevel     = 0;
        this._rank          = 0;
        this._isAmbassador  = false;

        return true;
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._clubLevel     = wrapper.readInt();
        this._rank          = wrapper.readInt();
        this._isAmbassador  = wrapper.readBoolean();

        return true;
    }

    public get clubLevel(): number
    {
        return this._clubLevel;
    }

    public get rank(): number
    {
        return this._rank;
    }

    public get isAmbassador(): boolean
    {
        return this._isAmbassador;
    }
}