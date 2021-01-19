import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';

export class PlaceBotComposer implements IMessageComposer<ConstructorParameters<typeof PlaceBotComposer>>
{
    private _data: ConstructorParameters<typeof PlaceBotComposer>;

    constructor(botId: number, x: number, y: number)
    {
        this._data = [ botId, x, y ];
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