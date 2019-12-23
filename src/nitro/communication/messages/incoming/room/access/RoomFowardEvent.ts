import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { RoomFowardParser } from '../../../parser/room/access/RoomFowardParser';

export class RoomFowardEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoomFowardParser);
    }

    public getParser(): RoomFowardParser
    {
        return this.parser as RoomFowardParser;
    }
}