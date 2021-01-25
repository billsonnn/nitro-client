import { Component, NgZone } from '@angular/core';
import { CatalogLayout } from '../../../CatalogLayout';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { CatalogService } from '../../../services/catalog.service';
import { CatalogClubOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogClubOfferData';


@Component({
    templateUrl: './vip-buy.template.html'
})
export class CatalogLayoutVipBuyComponent extends CatalogLayout
{
    public static CODE: string = 'vip_buy';
    public vipOffers: CatalogClubOfferData[] = [];
    constructor(
        protected _catalogService: CatalogService,
        protected _ngZone: NgZone)
    {
        super(_catalogService, _ngZone);
        _catalogService.registerVipBuyTemplate(this);
        _catalogService.requestOffers(6);
    }

    public setOffers(offers: CatalogClubOfferData[]): void
    {
        this._ngZone.run(() =>
        {
            this.vipOffers = offers;
        });

    }


    public getPurseContent(): string
    {
        const purse = this._catalogService.purse;
        const clubDays = purse.clubDays;
        const clubPeriods = purse.clubPeriods;

        const value = (clubPeriods * 31) + clubDays;
        // TODO: Register this in the localization
        return Nitro.instance.localization.getValueWithParameter('catalog.vip.extend.info', 'days', value.toString());
    }

    public buyVip(offer: CatalogClubOfferData): void
    {
        this._catalogService.component && this._catalogService.component.confirmVipSubscription(offer);
    }
}
