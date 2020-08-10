import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../core/communication/messages/IMessageParser';

export class NavigatorTabsParser implements IMessageParser
{
    private _tabs: string[];

    public flush(): boolean
    {
        this._tabs = [];

        return true;
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        let totalTabs = wrapper.readInt();

        while(totalTabs > 0)
        {
            this._tabs.push(wrapper.readString());

            wrapper.readInt();
            
            totalTabs--;
        }
        
        return true;
    }
}