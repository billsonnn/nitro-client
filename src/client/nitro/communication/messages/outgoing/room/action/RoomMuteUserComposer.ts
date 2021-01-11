import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';

export class RoomMuteUserComposer implements IMessageComposer
{
    private _data: any[];

    constructor(userId: number, minutes: number, roomId: number = 0)
    {
        this._data = [ userId, minutes, roomId ];
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