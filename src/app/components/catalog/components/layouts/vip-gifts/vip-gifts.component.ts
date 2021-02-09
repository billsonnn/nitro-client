import { Component, NgZone } from '@angular/core';
import { CatalogClubOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogClubOfferData';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { CatalogLayout } from '../../../CatalogLayout';
import { CatalogService } from '../../../services/catalog.service';
import { CatalogPageOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';


@Component({
    templateUrl: './vip-gifts.template.html'
})
export class CatalogLayoutVipGiftsComponent extends CatalogLayout
{
    public static CODE: string = 'club_gifts';
    public vipOffers: CatalogClubOfferData[] = [];
    constructor(
        protected _catalogService: CatalogService,
        protected _ngZone: NgZone)
    {
        super(_catalogService, _ngZone);

    }

    public get visible(): boolean
    {
        return this._catalogService.clubGiftsParser !== null;
    }



    public get gifts(): CatalogPageOfferData[]
    {
        if(!this.visible) return [];

        return this._catalogService.clubGiftsParser.offers;
    }


    public get giftsAvailable(): string
    {
        if(!this.visible) return '';

        let translater: string;

        const parser = this._catalogService.clubGiftsParser;

        if(parser._Str_7574 > 0)
        {
            translater = Nitro.instance.localization.getValueWithParameter('catalog.club_gift.available', 'amount', parser._Str_7574.toString());
        }
        else
        {
            if(parser._Str_12860 > 0)
            {
                translater = Nitro.instance.localization.getValueWithParameter('catalog.club_gift.days_until_next', 'days', parser._Str_12860.toString());
            }
            else
            {
                if(this._catalogService.hasClubDays())
                {
                    translater = Nitro.instance.localization.getValue('catalog.club_gift.not_available');
                }
                else
                {
                    translater = Nitro.instance.localization.getValue('catalog.club_gift.no_club');
                }
            }
        }



        return translater;
    }

}
