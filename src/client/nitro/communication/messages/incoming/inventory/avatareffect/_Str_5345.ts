import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_7054 } from '../../../parser/inventory/avatareffect/_Str_7054';

export class _Str_5345 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_7054);
    }

    public getParser(): _Str_7054
    {
        return this.parser as _Str_7054;
    }
}