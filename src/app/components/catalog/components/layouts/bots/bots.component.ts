import { Component, NgZone } from '@angular/core';
import { CatalogLayout } from '../../../CatalogLayout';
import { CatalogService } from '../../../services/catalog.service';
import { CatalogPageOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { ProductTypeEnum } from '../../../enums/ProductTypeEnum';
import { CatalogProductOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogProductOfferData';
import { IFurnitureData } from '../../../../../../client/nitro/session/furniture/IFurnitureData';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { AvatarScaleType } from '../../../../../../client/nitro/avatar/enum/AvatarScaleType';
import { AvatarSetType } from '../../../../../../client/nitro/avatar/enum/AvatarSetType';
import { IAvatarImageListener } from '../../../../../../client/nitro/avatar/IAvatarImageListener';

@Component({
    templateUrl: './bots.template.html'
})
export class CatalogLayoutBotsComponent extends CatalogLayout implements IAvatarImageListener
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

    public getBotImage(offer: CatalogPageOfferData): string
    {
        if(!offer) return '';

        const product = offer.products[0];

        if(!product) return '';

        const avatarImage = Nitro.instance.avatar.createAvatarImage(product.extraParam, AvatarScaleType.LARGE, 'M', this, null);

        if(avatarImage)
        {
            avatarImage.setDirection(AvatarSetType.HEAD, 2);

            const image = avatarImage.getCroppedImage(AvatarSetType.HEAD, 4);

            const src = image.src;
            avatarImage.dispose();
            if(src) return src;
        }

        return '';
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

    disposed: boolean;

    dispose(): void
    {
    }

    resetFigure(figure: string): void
    {
    }
}
