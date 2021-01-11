import { IMessageComposer } from '../../../../../../../core/communication/messages/IMessageComposer';

export class RoomUnitChatComposer implements IMessageComposer
{
    private _data: any[];

    constructor(message: string, styleId: number = 0)
    {
        this._data = [ message, styleId ];
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