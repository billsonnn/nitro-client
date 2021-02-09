import { Component, NgZone } from '@angular/core';
import { CatalogLayout } from '../../../CatalogLayout';
import { CatalogService } from '../../../services/catalog.service';
import { CatalogPageOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { ProductTypeEnum } from '../../../enums/ProductTypeEnum';
import { CatalogProductOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogProductOfferData';
import { IFurnitureData } from '../../../../../../client/nitro/session/furniture/IFurnitureData';

@Component({
    templateUrl: './bots.template.html'
})
export class CatalogLayoutBotsComponent extends CatalogLayout
{
    public static CODE: string = 'bots';

    constructor(
        protected _catalogService: CatalogService,
        protected _ngZone: NgZone)
    {
        super(_catalogService, _ngZone);
    }

    public selectOffer(offer: CatalogPageOfferData): void
    {
        if(!offer) return;

        (this._catalogService.component && this._catalogService.component.selectOffer(offer));
    }

    public getFigureForBot(offer: CatalogPageOfferData): string
    {
        if(!offer) return '';

        const product = offer.products[0];

        if(!product) return '';

        return product.extraParam;
    }

    public offerImage(offer: CatalogPageOfferData): string
    {
        // Todo: Make image work.
        if(!offer) return '';

        const product = offer.products[0];

        if(!product) return '';

        const furniData = this.getProductFurniData(product);

        if(!furniData) return '';

        switch(product.productType)
        {
            case ProductTypeEnum.ROBOT:
                return this._catalogService.getFurnitureDataIconUrl(furniData);
        }

        return '';
    }

    public getProductFurniData(product: CatalogProductOfferData): IFurnitureData
    {
        if(!product) return null;

        return this._catalogService.getFurnitureDataForProductOffer(product);
    }
}
