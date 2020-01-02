import { IMessageEvent } from '../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../core/communication/messages/MessageEvent';
import { RoomRollingParser } from '../../parser/room/RoomRollingParser';

export class RoomRollingEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoomRollingParser);
    }

    public getParser(): RoomRollingParser
    {
        return this.parser as RoomRollingParser;
    }
}