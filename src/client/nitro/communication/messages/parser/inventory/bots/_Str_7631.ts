import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { AdvancedMap } from '../../../../../../core/utils/AdvancedMap';
import { _Str_3013 } from './_Str_3013';

export class _Str_7631 implements IMessageParser
{
    private _items: AdvancedMap<number, _Str_3013>;

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
        let _local_2 = k.readInt();

        while(_local_2 > 0)
        {
            const _local_4 = new _Str_3013(k);

            this._items.add(_local_4.id, _local_4);

            _local_2--;
        }

        return true;
    }

    public get items(): AdvancedMap<number, _Str_3013>
    {
        return this._items;
    }
}