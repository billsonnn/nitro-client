import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { _Str_5511 } from '../../../incoming/inventory/avatareffect/_Str_5511';

export class _Str_5747 implements IMessageParser
{
    private _effects: _Str_5511[];

    public flush(): boolean
    {
        this._effects = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        let totalEffects = wrapper.readInt();

        while(totalEffects > 0)
        {
            const effect = new _Str_5511();

            effect.type         = wrapper.readInt();
            effect._Str_3882    = wrapper.readInt();
            effect.duration     = wrapper.readInt();
            effect._Str_18572   = wrapper.readInt();
            effect._Str_12185   = wrapper.readInt();
            effect._Str_4010    = wrapper.readBoolean();

            this._effects.push(effect);

            totalEffects--;
        }

        return true;
    }

    public get effects(): _Str_5511[]
    {
        return this._effects;
    }
}