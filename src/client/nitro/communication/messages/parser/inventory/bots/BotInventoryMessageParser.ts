import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { AdvancedMap } from '../../../../../../core/utils/AdvancedMap';
import { BotData } from './BotData';

export class BotInventoryMessageParser implements IMessageParser
{
    private _items: AdvancedMap<number, BotData>;

    public flush(): boolean
    {
        if(this._items)
        {
            this._items.dispose();
            this._items = null;
        }

        return true;
    }

    public parse(k: IMessageDataWrapper): boolean
    {
        this._items = new AdvancedMap();
        let count = k.readInt();

        while(count > 0)
        {
            const data = new BotData(k);

            this._items.add(data.id, data);

            count--;
        }

        return true;
    }

    public get items(): AdvancedMap<number, BotData>
    {
        return this._items;
    }
}