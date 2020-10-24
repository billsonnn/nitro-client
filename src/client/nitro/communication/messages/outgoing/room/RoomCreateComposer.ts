import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class RoomCreateComposer implements IMessageComposer
{
    private _data: any[];

    constructor(roomName: string, roomDesc: string, modelName: string, categoryId: number, maxVisitors: number, tradeType: number)
    {
        this._data = [ roomName, roomDesc, modelName, categoryId, maxVisitors, tradeType ];
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