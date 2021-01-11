import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_7906 } from '../../../parser/inventory/bots/_Str_7906';

export class _Str_8269 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_7906);
    }

    public getParser(): _Str_7906
    {
        return this.parser as _Str_7906;
    }
}