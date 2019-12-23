import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { RoomStackHeightParser } from '../../../parser/room/mapping/RoomStackHeightParser';

export class RoomStackHeightEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoomStackHeightParser);
    }

    public getParser(): RoomStackHeightParser
    {
        return this.parser as RoomStackHeightParser;
    }
}