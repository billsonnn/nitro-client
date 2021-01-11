import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_9476 } from '../../../parser/inventory/bots/_Str_9476';

export class _Str_16597 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_9476);
    }

    public getParser(): _Str_9476
    {
        return this.parser as _Str_9476;
    }
}