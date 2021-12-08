import { CatalogPageMessageOfferData, FrontPageItem, IFurnitureData, ProductOfferMessageParser } from '@nitrots/nitro-renderer';
import { ICatalogLocalizationData } from '../../../common/ICatalogLocalizationData';
import { ICatalogPageParser } from '../../../common/ICatalogPageParser';
import { CatalogLayoutSearchResultsComponent } from './search-results.component';

export class SearchResultsPage implements ICatalogPageParser
{
    private _furni: IFurnitureData[] = null;
    private _offer: CatalogPageMessageOfferData = null;

    constructor(furni: IFurnitureData[])
    {
        this._furni = furni;
    }


    public get searchOffer(): CatalogPageMessageOfferData
    {
        return this._offer;
    }

    public selectSearchResult(data: IFurnitureData, parser: ProductOfferMessageParser): void
    {
        if(parser) this._offer = parser.offer;
    }

    public get acceptSeasonCurrencyAsCredits(): boolean
    {
        return false;
    }

    public get catalogType(): string
    {
        return CatalogLayoutSearchResultsComponent.CODE;
    }

    public get frontPageItems(): FrontPageItem[]
    {
        return [];
    }

    public get layoutCode(): string
    {
        return CatalogLayoutSearchResultsComponent.CODE;
    }

    public get localization(): ICatalogLocalizationData
    {
        return {
            images: [],
            texts: []
        };
    }

    public get offerId(): number
    {
        return null;
    }

    public get offers(): CatalogPageMessageOfferData[]
    {
        return [];
    }

    public get furni(): IFurnitureData[]
    {
        return this._furni;
    }

    public get pageId(): number
    {
        return -1;
    }
}
