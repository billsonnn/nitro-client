import { IMessageEvent } from '../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../core/communication/messages/MessageEvent';
import { NavigatorTabsParser } from '../../parser/navigator/NavigatorTabsParser';

export class NavigatorTabsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, NavigatorTabsParser);
    }

    public getParser(): NavigatorTabsParser
    {
        return this.parser as NavigatorTabsParser;
    }
}