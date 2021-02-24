import { Component } from '@angular/core';
import { CatalogPageOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { CatalogProductOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogProductOfferData';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { IFurnitureData } from '../../../../../../client/nitro/session/furniture/IFurnitureData';
import { CatalogLayout } from '../../../CatalogLayout';
import { ProductTypeEnum } from '../../../enums/ProductTypeEnum';
import { CatalogLayoutDefaultComponent } from '../default/default.component';
import { SearchResultsPage } from './SearchResultsPage';

@Component({
    templateUrl: './search-result.template.html'
})
export class CatalogLayoutSearchResultsComponent extends CatalogLayoutDefaultComponent
{
    public static CODE: string = 'search_results';

    public get searchItems(): IFurnitureData[]
    {
        if(!(this._catalogService.activePage instanceof SearchResultsPage)) return [];

        const page = <SearchResultsPage> this._catalogService.activePage;
        console.log('rendering furni amount: ', page.furni.length);
        return page.furni;
    }

    public requestOfferData(item: IFurnitureData): void
    {
        this._catalogService.requestOfferData(item.purchaseOfferId);
    }

    public get searchOffer(): CatalogPageOfferData
    {
        if(!(this._catalogService.activePage instanceof SearchResultsPage)) return null;

        return (this._catalogService.activePage as SearchResultsPage).searchOffer;
    }

    public searchItemImage(item: IFurnitureData): string
    {
        if(!item) return '';

        let result = null;
        result = this._catalogService.getFurnitureDataIconUrl(item);

        return result;

        // switch(product.productType)
        // {
        //     case ProductTypeEnum.FLOOR:
        //         return this._catalogService.getFurnitureDataIconUrl(furniData);
        //     case ProductTypeEnum.WALL:
        //         return this._catalogService.getFurnitureDataIconUrl(furniData);
        // }

        // return '';
    }
}
