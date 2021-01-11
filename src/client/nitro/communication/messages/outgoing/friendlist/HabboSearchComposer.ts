import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class HabboSearchComposer implements IMessageComposer
{
    private _data: any[];

    constructor(search: string)
    {
        this._data = [ search ];
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