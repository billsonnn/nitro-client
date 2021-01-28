import { Component, NgZone } from '@angular/core';
import { CatalogClubOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogClubOfferData';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { CatalogLayout } from '../../../CatalogLayout';
import { CatalogService } from '../../../services/catalog.service';


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
            this.vipOffers = offers.reverse();
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

    public getCurrencyUrl(type: number): string
    {
        const url = Nitro.instance.getConfiguration<string>('currency.asset.icon.url');

        return url.replace('%type%', type.toString());
    }

    public getOfferText(code: string)
    {
        return Nitro.instance.getLocalizationWithParameter('friendlytime.months.short', 'amount', code.replace(/[^\d.]/g, ''));
    }
}
