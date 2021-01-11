import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class RequestFriendComposer implements IMessageComposer
{
    private _data: any[];

    constructor(username: string)
    {
        this._data = [ username ];
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