import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';

export class FurniturePlacePaintComposer implements IMessageComposer
{
    private _data: any[];

    constructor(furniId: number)
    {
        this._data = [ furniId ];
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