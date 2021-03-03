import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_7183 } from '../../../parser/inventory/pets/_Str_7183';

export class PetRemovedEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_7183);
    }

    public getParser(): _Str_7183
    {
        return this.parser as _Str_7183;
    }
}
