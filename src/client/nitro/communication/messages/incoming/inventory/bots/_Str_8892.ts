import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_6995 } from '../../../parser/inventory/bots/_Str_6995';

export class _Str_8892 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_6995);
    }

    public getParser(): _Str_6995
    {
        return this.parser as _Str_6995;
    }
}