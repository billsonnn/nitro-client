import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';

export class RemoveBotFromFlatComposer implements IMessageComposer<ConstructorParameters<typeof RemoveBotFromFlatComposer>>
{
    private _data: ConstructorParameters<typeof RemoveBotFromFlatComposer>;

    constructor(botId: number)
    {
        this._data = [ botId ];
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