import { IMessageEvent } from '../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../core/communication/messages/MessageEvent';
import { ModtoolUserChatlogParser } from '../../parser/modtool/ModtoolUserChatlogParser';
import { ModtoolRoomChatlogParser } from '../../parser/modtool/ModtoolRoomChatlogParser';

export class ModtoolRoomChatlogEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ModtoolRoomChatlogParser);
    }

    public getParser(): ModtoolUserChatlogParser
    {
        return this.parser as ModtoolUserChatlogParser;
    }
}
