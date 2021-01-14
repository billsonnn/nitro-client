import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';

export class RoomBanUserComposer implements IMessageComposer<ConstructorParameters<typeof RoomBanUserComposer>>
{
    private _data: ConstructorParameters<typeof RoomBanUserComposer>;

    constructor(userId: number, type: string, roomId: number = 0)
    {
        this._data = [ userId, type, roomId ];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}