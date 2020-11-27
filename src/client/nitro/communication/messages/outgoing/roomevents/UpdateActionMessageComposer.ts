import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class UpdateActionMessageComposer implements IMessageComposer
{
    private _data: any[];

    constructor(id: number, ints: number[], string: string, stuffs: number[], selectionCode: number)
    {
        this._data = [ id, ints.length, ...ints, string, stuffs.length, ...stuffs, selectionCode ];
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