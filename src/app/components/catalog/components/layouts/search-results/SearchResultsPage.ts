import { ICatalogPageParser } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/ICatalogPageParser';
import { CatalogLayoutSearchResultsComponent } from './search-results.component';
import { CatalogFrontPageItem } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogFrontPageItem';
import { CatalogLocalizationData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogLocalizationData';
import { CatalogPageOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { ICatalogLocalizationData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/ICatalogLocalizationData';
import { IFurnitureData } from '../../../../../../client/nitro/session/furniture/IFurnitureData';

export class SearchResultsPage implements ICatalogPageParser
{
    private _furni: IFurnitureData[] = null;
    constructor(furni: IFurnitureData[])
    {
        this._furni = furni;
    }

    public get acceptSeasonCurrencyAsCredits(): boolean
    {
        return false;
    }

    public get catalogType(): string
    {
        return CatalogLayoutSearchResultsComponent.CODE;
    }

    public get frontPageItems(): CatalogFrontPageItem[]
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

    public get offers(): CatalogPageOfferData[]
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
