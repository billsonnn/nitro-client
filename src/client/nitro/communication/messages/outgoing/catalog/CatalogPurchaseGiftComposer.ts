import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class CatalogPurchaseGiftComposer implements IMessageComposer<ConstructorParameters<typeof CatalogPurchaseGiftComposer>>
{
    private _data: ConstructorParameters<typeof CatalogPurchaseGiftComposer>;

    constructor(k:number, _arg_2:number, _arg_3:string, _arg_4:string, _arg_5:string, _arg_6:number, _arg_7:number, _arg_8:number, _arg_9:boolean)
    {
        this._data = [ k, _arg_2, _arg_3, _arg_4, _arg_5, _arg_6, _arg_7, _arg_8,_arg_9];
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
