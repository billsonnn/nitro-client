import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';

export class RoomEnterParser implements IMessageParser
{
    public flush(): boolean
    {
        return true;
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        return true;
    }
}