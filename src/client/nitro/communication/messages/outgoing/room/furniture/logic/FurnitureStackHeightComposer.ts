import { IMessageComposer } from '../../../../../../../core/communication/messages/IMessageComposer';

export class FurnitureStackHeightComposer implements IMessageComposer
{
    private _data: any[];

    constructor(itemId: number, height: number = -100)
    {
        this._data = [ itemId, height ];
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