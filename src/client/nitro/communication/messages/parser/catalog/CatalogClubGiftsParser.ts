import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../core/communication/messages/IMessageParser';
import { CatalogClubOfferData } from './utils/CatalogClubOfferData';
import { CatalogPageOfferData } from './utils/CatalogPageOfferData';
import { _Str_5178 } from './utils/_Str_5178';

export class CatalogClubGiftsParser implements IMessageParser
{
    private  _Str_10647:number;
    private  _Str_5369:number;
    private _offers: CatalogPageOfferData[];
    private  _Str_5759:Map<number, _Str_5178>;

    public flush(): boolean
    {

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._offers = [];
        this._Str_5759 = new Map<number, _Str_5178>();
        this._Str_10647 = wrapper.readInt();
        this._Str_5369 = wrapper.readInt();

        let local2 = wrapper.readInt();

        let local3 = 0;

        while(local3 < local2)
        {
            this._offers.push(new CatalogPageOfferData(wrapper));
            local3++;
        }

        local2 = wrapper.readInt();
        local3 = 0;

        while(local3 < local2)
        {
            const item = new _Str_5178(wrapper);
            this._Str_5759.set(item.offerId, item);
            local3++;
        }

        return true;
    }

    public get offers(): CatalogPageOfferData[]
    {
        return this._offers;
    }

    public  get _Str_12860():number
    {
        return this._Str_10647;
    }

    public  get _Str_7574():number
    {
        return this._Str_5369;
    }


    public  get _Str_24398():Map<number, _Str_5178>
    {
        return this._Str_5759;
    }
}
