import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_6941 } from '../../../parser/inventory/badges/_Str_6941';

export class _Str_5147 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_6941);
    }

    public getParser(): _Str_6941
    {
        return this.parser as _Str_6941;
    }
}