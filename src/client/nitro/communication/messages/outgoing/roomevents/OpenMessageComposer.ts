import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class OpenMessageComposer implements IMessageComposer
{
    private _data: any[];

    constructor(id: number)
    {
        this._data = [ id ];
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