import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';

export class RoomSettingsComposer implements IMessageComposer<ConstructorParameters<typeof RoomSettingsComposer>>
{
    private _data: ConstructorParameters<typeof RoomSettingsComposer>;

    constructor(roomId: number)
    {
        this._data = [ roomId ];
    }

    public getMessageArray()
    {
        return this._data;
    }

    dispose(): void
    {
        return;
    }
}
