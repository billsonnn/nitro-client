import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';

export class TradingListAddItemsComposer implements IMessageComposer
{
    private _data: any[];

    constructor(itemIds: number[])
    {
        this._data = [ itemIds.length, ...itemIds ];
    }

    public getMessageArray(): any[]
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}