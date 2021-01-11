import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_8175 } from '../../../parser/inventory/avatareffect/_Str_8175';

export class _Str_5720 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_8175);
    }

    public getParser(): _Str_8175
    {
        return this.parser as _Str_8175;
    }
}