import { Directive, NgZone } from '@angular/core';
import { CatalogPageParser } from '../../../client/nitro/communication/messages/parser/catalog/CatalogPageParser';
import { CatalogPageOfferData } from '../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { Nitro } from '../../../client/nitro/Nitro';
import { RoomPreviewer } from '../../../client/nitro/room/preview/RoomPreviewer';
import { CatalogService } from './services/catalog.service';

@Directive()
export class CatalogLayout
{
    public activePage: CatalogPageParser = null;

    constructor(
        protected _catalogService: CatalogService,
        protected _ngZone: NgZone)
    {}

    public getText(index: number = 0): string
    {
        let message = (this.activePage.localization.texts[index] || null);

        message = message.replace(/\r\n|\r|\n/g, '<br />');

        return message;
    }

    public getImage(index: number = 0): string
    {
        let imageUrl = Nitro.instance.getConfiguration<string>('catalog.asset.image.url');

        imageUrl = imageUrl.replace('%name%', this.activePage.localization.images[index]);

        return imageUrl;
    }

    public get headerText(): string
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
}
