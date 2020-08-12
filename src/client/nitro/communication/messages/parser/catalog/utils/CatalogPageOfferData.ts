import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { CatalogProductOfferData } from './CatalogProductOfferData';

export class CatalogPageOfferData
{
    private _offerId: number;
    private _localizationId: string;
    private _rent: boolean;
    private _priceCredits: number;
    private _priceActivityPoints: number;
    private _priceActivityPointsType: number;
    private _clubLevel: number;
    private _giftable: boolean;
    private _bundlePurchaseAllowed: boolean;
    private _isPet: boolean;
    private _previewImage: string;
    private _products: CatalogProductOfferData[];

    constructor(wrapper: IMessageDataWrapper)
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this.flush();
        this.parse(wrapper);
    }

    public flush(): boolean
    {
        this._offerId                   = -1;
        this._localizationId            = null;
        this._rent                      = false;
        this._priceCredits              = 0;
        this._priceActivityPoints       = 0;
        this._priceActivityPointsType   = 0;
        this._clubLevel                 = 0;
        this._giftable                  = false;
        this._bundlePurchaseAllowed     = false;
        this._isPet                     = false;
        this._previewImage              = null;
        this._products                  = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._offerId                   = wrapper.readInt();
        this._localizationId            = wrapper.readString();
        this._rent                      = wrapper.readBoolean();
        this._priceCredits              = wrapper.readInt();
        this._priceActivityPoints       = wrapper.readInt();
        this._priceActivityPointsType   = wrapper.readInt();
        this._giftable                  = wrapper.readBoolean();

        let totalProducts = wrapper.readInt();

        while(totalProducts > 0)
        {
            this._products.push(new CatalogProductOfferData(wrapper));

            totalProducts--;
        }

        this._clubLevel             = wrapper.readInt();
        this._bundlePurchaseAllowed = wrapper.readBoolean();
        this._isPet                 = wrapper.readBoolean();
        this._previewImage          = wrapper.readString();

        return true;
    }

    public get offerId(): number
    {
        return this._offerId;
    }

    public get localizationId(): string
    {
        return this._localizationId;
    }

    public get rent(): boolean
    {
        return this._rent;
    }

    public get priceCredits(): number
    {
        return this._priceCredits;
    }

    public get priceActivityPoints(): number
    {
        return this._priceActivityPoints;
    }

    public get priceActivityPointsType(): number
    {
        return this._priceActivityPointsType;
    }

    public get clubLevel(): number
    {
        return this._clubLevel;
    }

    public get giftable(): boolean
    {
        return this._giftable;
    }

    public get bundlePurchaseAllowed(): boolean
    {
        return this._bundlePurchaseAllowed;
    }

    public get isPet(): boolean
    {
        return this._isPet;
    }

    public get previewImage(): string
    {
        return this._previewImage;
    }

    public get products(): CatalogProductOfferData[]
    {
        return this._products;
    }
}