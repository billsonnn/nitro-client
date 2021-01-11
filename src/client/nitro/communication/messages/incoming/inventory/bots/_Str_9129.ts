import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_7631 } from '../../../parser/inventory/bots/_Str_7631';

export class _Str_9129 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_7631);
    }

    public getParser(): _Str_7631
    {
        return this.parser as _Str_7631;
    }
}