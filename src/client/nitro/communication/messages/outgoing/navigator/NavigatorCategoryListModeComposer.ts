import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class NavigatorCategoryListModeComposer implements IMessageComposer
{
    private _data: any[];

    constructor(category: string, listmode: number)
    {
        this._data = [category, listmode];
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