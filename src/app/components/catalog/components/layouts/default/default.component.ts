import { Component } from '@angular/core';
import { CatalogPageOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { CatalogProductOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogProductOfferData';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { IFurnitureData } from '../../../../../../client/nitro/session/furniture/IFurnitureData';
import { CatalogLayout } from '../../../CatalogLayout';
import { ProductTypeEnum } from '../../../enums/ProductTypeEnum';
import { FurnitureType } from '../../../../../../client/nitro/session/furniture/FurnitureType';

@Component({
    templateUrl: './default.template.html'
})
export class CatalogLayoutDefaultComponent extends CatalogLayout
{
    public static CODE: string = 'default_3x3';


    public selectOffer(offer: CatalogPageOfferData): void
    {
        if(!offer) return;

        const product = offer.products[0];

        if(!product) return;

        const typesWithoutPreviewer = [ProductTypeEnum.BADGE];

        this.roomPreviewerVisible = typesWithoutPreviewer.indexOf(product.productType) == -1;

        (this._catalogService.component && this._catalogService.component.selectOffer(offer));
    }


    public getProductFurniData(product: CatalogProductOfferData): IFurnitureData
    {
        if(!product) return null;

        return this._catalogService.getFurnitureDataForProductOffer(product);
    }

    public offerImage(offer: CatalogPageOfferData): string
    {
        if(!offer) return '';

        const product = offer.products[0];

        if(!product) return '';

        if(product.productType.toUpperCase() == FurnitureType.BADGE)
        {
            return Nitro.instance.sessionDataManager.getBadgeUrl(product.extraParam);
        }

        const furniData = this.getProductFurniData(product);

        if(!furniData) return '';

        switch(product.productType)
        {
            case ProductTypeEnum.FLOOR:
                return this._catalogService.getFurnitureDataIconUrl(furniData);
            case ProductTypeEnum.WALL:
                return this._catalogService.getFurnitureDataIconUrl(furniData);
        }

        return '';
    }

    public offerCount(offer: CatalogPageOfferData): number
    {
        if(!this.hasMultipleProducts(offer))
        {
            const product = this.getFirstProduct(offer);

            if(product) return product.productCount;
        }

        return 1;
    }
}
