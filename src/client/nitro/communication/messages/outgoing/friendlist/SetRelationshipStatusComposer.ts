import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class SetRelationshipStatusComposer implements IMessageComposer
{
    private _data: any[];

    constructor(userId: number, relationship: number)
    {
        this._data = [ userId, relationship ];
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