import { Directive, NgZone } from '@angular/core';
import { CatalogPageParser } from '../../../client/nitro/communication/messages/parser/catalog/CatalogPageParser';
import { CatalogPageOfferData } from '../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { Nitro } from '../../../client/nitro/Nitro';
import { RoomPreviewer } from '../../../client/nitro/room/preview/RoomPreviewer';
import { CatalogService } from './services/catalog.service';
import { ProductTypeEnum } from './enums/ProductTypeEnum';
import { CatalogProductOfferData } from '../../../client/nitro/communication/messages/parser/catalog/utils/CatalogProductOfferData';
import { IFurnitureData } from '../../../client/nitro/session/furniture/IFurnitureData';

@Directive()
export class CatalogLayout
{
    public activePage: CatalogPageParser = null;
    public roomPreviewerVisible: boolean = true;

    constructor(
        protected _catalogService: CatalogService,
        protected _ngZone: NgZone)
    {}

    public getText(index: number = 0): string
    {
        let message = (this.activePage.localization.texts[index] || null);

        if(message) message = message.replace(/\r\n|\r|\n/g, '<br />');

        return (message || '');
    }

    public getImage(index: number = 0): string
    {
        let imageUrl = Nitro.instance.getConfiguration<string>('catalog.asset.image.url');

        imageUrl = imageUrl.replace('%name%', this.activePage.localization.images[index]);

        return imageUrl;
    }

    protected get headerText(): string
    {
        return (this._catalogService.catalogRoot.localization || null);
    }

    public get offers(): CatalogPageOfferData[]
    {
        return this._catalogService.activePage.offers;
    }

    public get activeOffer(): CatalogPageOfferData
    {
        return ((this._catalogService.component && this._catalogService.component.activeOffer) || null);
    }

    public get roomPreviewer(): RoomPreviewer
    {
        return ((this._catalogService.component && this._catalogService.component.roomPreviewer) || null);
    }

    public getCurrencyUrl(type: number): string
    {
        const url = Nitro.instance.getConfiguration<string>('currency.asset.icon.url');

        return url.replace('%type%', type.toString());
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

    public hasMultipleProducts(offer: CatalogPageOfferData): boolean
    {
        return (offer.products.length > 1);
    }

    public offerName(offer: CatalogPageOfferData): string
    {
        let key = '';

        const product = this.getFirstProduct(offer);

        if(product)
        {
            switch(product.productType)
            {
                case ProductTypeEnum.FLOOR:
                    key = 'roomItem.name.' + product.furniClassId;
                    break;
                case ProductTypeEnum.WALL:
                    key = 'wallItem.name.' + product.furniClassId;
                    break;
                case ProductTypeEnum.BADGE:
                    return offer.localizationId;
                case ProductTypeEnum.ROBOT: {
                    const productData = Nitro.instance.sessionDataManager.getProductData(offer.localizationId);
                    if(productData) return productData.name;
                }
                    break;
            }
        }

        if(key === '') return key;

        return Nitro.instance.getLocalization(key);
    }

    public getFirstProduct(offer: CatalogPageOfferData): CatalogProductOfferData
    {
        return ((offer && offer.products[0]) || null);
    }

}
