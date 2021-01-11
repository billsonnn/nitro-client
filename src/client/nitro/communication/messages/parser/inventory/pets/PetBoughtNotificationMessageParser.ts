import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { _Str_2848 } from './_Str_2848';

export class PetBoughtNotificationMessageParser implements IMessageParser
{
    private _gift: boolean;
    private _pet: _Str_2848;

    public flush(): boolean
    {
        return true;
    }

    public parse(k: IMessageDataWrapper): boolean
    {
        this._gift  = k.readBoolean();
        this._pet   = new _Str_2848(k);

        return true;
    }

    public get gift(): boolean
    {
        return this._gift;
    }

    public get pet(): _Str_2848
    {
        return this._pet;
    }
}