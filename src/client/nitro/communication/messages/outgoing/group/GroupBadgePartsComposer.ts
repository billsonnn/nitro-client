import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class GroupBadgePartsComposer implements IMessageComposer<ConstructorParameters<typeof GroupBadgePartsComposer>>
{
    private _data: ConstructorParameters<typeof GroupBadgePartsComposer>;

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
