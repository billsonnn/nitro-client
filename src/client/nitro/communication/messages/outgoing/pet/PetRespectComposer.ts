import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class PetRespectComposer implements IMessageComposer
{
    private _data: any[];

    constructor(petId: number)
    {
        this._data = [ petId ];
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