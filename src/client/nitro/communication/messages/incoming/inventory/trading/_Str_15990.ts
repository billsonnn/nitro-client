import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_10279 } from '../../../parser/inventory/trading/_Str_10279';

export class _Str_15990 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_10279);
    }

    public getParser(): _Str_10279
    {
        return this.parser as _Str_10279;
    }
}