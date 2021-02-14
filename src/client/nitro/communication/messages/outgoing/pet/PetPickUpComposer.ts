import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class PetPickUpComposer implements IMessageComposer<ConstructorParameters<typeof PetPickUpComposer>>
{
    private _data: ConstructorParameters<typeof PetPickUpComposer>;

    constructor(petId: number)
    {
        this._data = [ petId ];
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
