import { IMessageEvent } from '../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../core/communication/messages/MessageEvent';
import { WiredFurniActionParser } from '../../parser/roomevents/WiredFurniActionparser';

export class WiredFurniActionEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredFurniActionParser);
    }

    public getParser(): WiredFurniActionParser
    {
        return this.parser as WiredFurniActionParser;
    }
}