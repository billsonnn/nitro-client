import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';

export class RoomBanUserComposer implements IMessageComposer
{
    private _data: any[];

    constructor(userId: number, type: string, roomId: number = 0)
    {
        this._data = [ userId, type, roomId ];
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