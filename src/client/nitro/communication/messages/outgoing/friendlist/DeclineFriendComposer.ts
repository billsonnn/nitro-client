import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class DeclineFriendComposer implements IMessageComposer
{
    private _data: any[];

    constructor(removeAll: boolean, ...userIds: number[])
    {
        this._data = [ removeAll, userIds.length, ...userIds ];
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