import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_5747 } from '../../../parser/inventory/avatareffect/_Str_5747';

export class _Str_6450 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_5747);
    }

    public getParser(): _Str_5747
    {
        return this.parser as _Str_5747;
    }
}