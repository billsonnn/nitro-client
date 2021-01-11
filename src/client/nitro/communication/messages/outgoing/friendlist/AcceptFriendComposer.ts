import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class AcceptFriendComposer implements IMessageComposer
{
    private _data: any[];

    constructor(...userIds: number[])
    {
        this._data = [ userIds.length, ...userIds ];
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