import { Component, Input, NgZone, OnInit } from '@angular/core';
import { CatalogLayout } from '../../../../../CatalogLayout';
import { MarketplaceOfferItem } from '../../../../../../../../client/nitro/communication/messages/parser/catalog/utils/MarketplaceOfferItem';
import { MarketplaceOfferData } from '../../../../../../../../client/nitro/communication/messages/parser/catalog/utils/MarketplaceOfferData';
import { Nitro } from '../../../../../../../../client/nitro/Nitro';
import { MarketplaceService } from '../../../../../services/marketplace.service';
import { NotificationService } from '../../../../../../notification/services/notification.service';
import { Purse } from '../../../../../purse/purse';
import { PurseService } from '../../../../../../purse/services/purse.service';

@Component({
    templateUrl: './template.html',
    selector: '[nitro-marketplace-offer]',
})
export class CatalogLayoutMarketplaceMarketplaceOfferComponent
{
    @Input()
    public offer: MarketplaceOfferItem;

    constructor(private _marketplaceService: MarketplaceService,
        private _notificationService: NotificationService,
        private _ngZone: NgZone,
        private _purseService: PurseService)
    {

    }


    public get imageUrlOffer(): string
    {
        if(!this.offer) return '';

        switch(this.offer.furniType)
        {
            case 1:
                return Nitro.instance.roomEngine.getFurnitureFloorIconUrl(this.offer.furniId);
            case 2:
                return Nitro.instance.roomEngine.getFurnitureWallIconUrl(this.offer.furniId, this.offer.extraData);
        }

        return '';
    }

    public get marketplaceOfferTitle(): string
    {
        if(!this.offer) return '';

        const localizationKey = this.offer.furniType == 2  ? 'wallItem.name.' + this.offer.furniId: 'roomItem.name.' + this.offer.furniId;

        return Nitro.instance.localization.getValue(localizationKey);
    }

    public get marketplaceOfferDescription(): string
    {
        if(!this.offer) return '';

        const offer = this.offer;

        const localizationKey =  offer.furniType == 2 ? 'wallItem.desc.' + offer.furniId : 'roomItem.desc.' + offer.furniId;

        return Nitro.instance.localization.getValue(localizationKey);
    }

    public get marketplacePrice(): string
    {
        if(!this.offer) return '';

        return Nitro.instance.localization.getValueWithParameter('catalog.marketplace.offer.price_own_item', 'price', this.offer.price.toString());
    }

    public get averagePrice(): string
    {
        const price = this.offer.price;
        const average = this.offer._Str_3925;

        const averageText = average != 0 ? average.toString() : ' - ';

        return Nitro.instance.localization.getValueWithParameters('catalog.marketplace.offer.price_public_item',
            [
                'price',
                'average'
            ],
            [
                price.toString(),
                averageText
            ]);
    }

    public get offerCount(): string
    {
        return  Nitro.instance.localization.getValueWithParameter('catalog.marketplace.offer_count', 'count', this.offer._Str_4121.toString());
    }

    public get description(): string
    {
        if(!this.offer) return '';

        const localizationKey =  this.offer.furniType == 2 ? 'wallItem.desc.' + this.offer.furniId : 'roomItem.desc.' + this.offer.furniId;

        return Nitro.instance.localization.getValue(localizationKey);
    }

    public buy(): void
    {
        const purseCurrencies = this._purseService.currencies;

        const currentCredits = purseCurrencies.get(-1);

        if(currentCredits < this.offer.price)
        {
            this._notificationService.alert(Nitro.instance.localization.getValue('catalog.alert.notenough.credits.description'), Nitro.instance.localization.getValue('catalog.alert.notenough.title'));
            return;
        }

        this._ngZone.run(() => this._marketplaceService.buyOffer(this.offer));
    }
}
