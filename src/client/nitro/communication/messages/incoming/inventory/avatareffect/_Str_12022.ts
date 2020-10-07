import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_9648 } from '../../../parser/inventory/avatareffect/_Str_9648';

export class _Str_12022 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_9648);
    }

    public getParser(): _Str_9648
    {
        return this.parser as _Str_9648;
    }
}