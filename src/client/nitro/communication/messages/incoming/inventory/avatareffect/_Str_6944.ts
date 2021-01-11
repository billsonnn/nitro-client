import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_7398 } from '../../../parser/inventory/avatareffect/_Str_7398';

export class _Str_6944 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_7398);
    }

    public getParser(): _Str_7398
    {
        return this.parser as _Str_7398;
    }
}