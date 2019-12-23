import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { UserRightsParser } from '../../../parser/user/access/UserRightsParser';

export class UserRightsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, UserRightsParser);
    }

    public getParser(): UserRightsParser
    {
        return this.parser as UserRightsParser;
    }
}