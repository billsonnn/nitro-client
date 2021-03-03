import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_8182 } from '../../../parser/inventory/pets/_Str_8182';

export class PetAddedEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_8182);
    }

    public getParser(): _Str_8182
    {
        return this.parser as _Str_8182;
    }
}
