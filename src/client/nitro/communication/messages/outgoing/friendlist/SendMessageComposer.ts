import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class SendMessageComposer implements IMessageComposer
{
    private _data: any[];

    constructor(userId: number, message: string)
    {
        this._data = [ userId, message ];
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