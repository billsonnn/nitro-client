import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';

export class TradingListItemRemoveComposer implements IMessageComposer
{
    private _data: any[];

    constructor(itemId: number)
    {
        this._data = [ itemId ];
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