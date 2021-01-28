import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';

export class UserInfoComposer implements IMessageComposer<ConstructorParameters<typeof UserInfoComposer>>
{
    private _data: ConstructorParameters<typeof UserInfoComposer>;

    constructor()
    {
        this._data = [];
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