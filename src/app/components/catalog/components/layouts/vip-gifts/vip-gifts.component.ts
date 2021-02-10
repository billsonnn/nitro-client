import { Component, NgZone } from '@angular/core';
import { CatalogClubOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogClubOfferData';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { CatalogLayout } from '../../../CatalogLayout';
import { CatalogService } from '../../../services/catalog.service';
import { CatalogPageOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { Vector3d } from '../../../../../../client/room/utils/Vector3d';
import { CatalogPurchaseComposer } from '../../../../../../client/nitro/communication/messages/outgoing/catalog/CatalogPurchaseComposer';
import { CatalogSelectClubGiftComposer } from '../../../../../../client/nitro/communication/messages/outgoing/catalog/CatalogSelectClubGiftComposer';


@Component({
    templateUrl: './vip-gifts.template.html'
})
export class CatalogLayoutVipGiftsComponent extends CatalogLayout
{
    public static CODE: string = 'club_gifts';
    public showPopup: boolean = false;

    public vipOffers: CatalogClubOfferData[] = [];
    private _currentSelectedVipOffer: CatalogPageOfferData = null;
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

    public hidePopup(): void
    {
        this.showPopup = false;
    }

    public getAvailability(offerId: number): boolean
    {
        const test = this._catalogService.clubGiftsParser.getOfferExtraData(offerId);

        return test.isSelectable && this._catalogService.clubGiftsParser._Str_7574 > 0;
    }

    public get gifts(): CatalogPageOfferData[]
    {
        if(!this.visible) return [];

        return this._catalogService.clubGiftsParser.offers;
    }

    public get direction(): Vector3d
    {
        return new Vector3d(90);
    }

    public selectOffer(item :CatalogPageOfferData): void
    {
        this._currentSelectedVipOffer = item;
        this.showPopup = true;
    }

    public getGiftImage(): string
    {
        return this.offerImage(this._currentSelectedVipOffer);
    }

    public giftName(): string
    {
        return this.getProductFurniData(this._currentSelectedVipOffer.products[0]).name;
    }

    public confirmGift(): void
    {
        Nitro.instance.communication.connection.send(new CatalogSelectClubGiftComposer(this._currentSelectedVipOffer.localizationId));
        this.showPopup = false;
    }
    public get pastClubDays(): string
    {
        const local7 = this._catalogService.purse.pastClubDays;
        const month = 31;

        const local2 = (local7 > month) ? 'catalog.club_gift.past_club.long': 'catalog.club_gift.past_club';
        const local3 = Math.floor(local7 % month);
        const local4 = Math.floor(local7 / month);

        let text = Nitro.instance.localization.getValue(local2);
        text = text.replace('%days%', local3.toString());
        text = text.replace('%months%', local4.toString());
        return text;
    }

    public nonAvailableText(offerId: number): string
    {
        const test = this._catalogService.clubGiftsParser.getOfferExtraData(offerId);

        const local6 =  test.availableInDays - this._catalogService.purse.pastClubDays;

        if(local6 <= 0) return '';

        const monthDays = 31;

        let local7 = '';

        if(test._Str_12313)
        {
            local7 = 'catalog.club_gift.vip_missing';
        }
        else
        {
            local7 = 'catalog.club_gift.club_missing';
        }



        if(local6 > monthDays)
        {
            local7 += '.long';
        }

        const local12 = local6 % monthDays;
        const local13 = local6 / monthDays;

        let text = Nitro.instance.localization.getValue(local7);

        text = text.replace('%days%', local12.toString());
        text = text.replace('%months%', local13.toString());

        return text;

        return '';
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
