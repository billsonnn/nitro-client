import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class SendRoomInviteComposer implements IMessageComposer
{
    private _data: any[];

    constructor(message: string, ...userIds: number[])
    {
        this._data = [ message, userIds.length, ...userIds ];
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