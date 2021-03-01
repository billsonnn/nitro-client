import { Directive, NgZone } from '@angular/core';
import { CatalogPageOfferData } from '../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { CatalogProductOfferData } from '../../../client/nitro/communication/messages/parser/catalog/utils/CatalogProductOfferData';
import { ICatalogPageParser } from '../../../client/nitro/communication/messages/parser/catalog/utils/ICatalogPageParser';
import { Nitro } from '../../../client/nitro/Nitro';
import { RoomPreviewer } from '../../../client/nitro/room/preview/RoomPreviewer';
import { IFurnitureData } from '../../../client/nitro/session/furniture/IFurnitureData';
import { ProductTypeEnum } from './enums/ProductTypeEnum';
import { CatalogService } from './services/catalog.service';

@Directive()
export class CatalogLayout
{
    public activePage: ICatalogPageParser = null;

    constructor(
        protected _catalogService: CatalogService,
        protected _ngZone: NgZone)
    {}

    public getText(index: number = 0): string
    {
        let message = (this.activePage.localization.texts[index] || '');

        if(message && message.length) message = message.replace(/\r\n|\r|\n/g, '<br />');

        return (message || '');
    }

    public getImage(index: number = 0): string
    {
        const imageName = this.activePage.localization.images && this.activePage.localization.images[index];

        if(!imageName || !imageName.length) return null;

        let assetUrl = Nitro.instance.getConfiguration<string>('catalog.asset.image.url');

        assetUrl = assetUrl.replace('%name%', imageName);

        return assetUrl;
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
}
