import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Nitro } from '../../../../client/nitro/Nitro';
import { MarketplaceRequestOwnItemsComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/marketplace/MarketplaceRequestOwnItemsComposer';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { CatalogClubEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogClubEvent';
import { CatalogModeEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogModeEvent';
import { CatalogPageEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogPageEvent';
import { CatalogPagesEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogPagesEvent';
import { CatalogPurchaseEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogPurchaseEvent';
import { CatalogPurchaseFailedEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogPurchaseFailedEvent';
import { CatalogPurchaseUnavailableEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogPurchaseUnavailableEvent';
import { CatalogSearchEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogSearchEvent';
import { CatalogSoldOutEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogSoldOutEvent';
import { CatalogUpdatedEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogUpdatedEvent';
import { CatalogGroupsEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogGroupsEvent';
import { UserSubscriptionEvent } from '../../../../client/nitro/communication/messages/incoming/user/inventory/subscription/UserSubscriptionEvent';
import { CatalogGiftConfigurationEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogGiftConfigurationEvent';
import { CatalogGiftUsernameUnavailableEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogGiftUsernameUnavailableEvent';
import { CatalogClubGiftsEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogClubGiftsEvent';
import { CatalogRedeemVoucherErrorEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogRedeemVoucherErrorEvent';
import { CatalogRedeemVoucherOkEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogRedeemVoucherOkEvent';
import { CatalogRequestGiftConfigurationComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogRequestGiftConfigurationComposer';
import { MarketplaceOwnItemsEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/marketplace/MarketplaceOwnItemsEvent';
import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
import { MarketplaceOfferData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/MarketplaceOfferData';
import { FurnitureType } from '../../../../client/nitro/session/furniture/FurnitureType';

@Injectable()
export class MarketplaceService implements OnDestroy
{

    public static _Str_20923:number = 1;
    public static _Str_15376:number = 1;
    public static _Str_8295:number = 2;
    public static _Str_6495:number = 3;


    private _lastOwnOffers: AdvancedMap<number, MarketplaceOfferData>;
    private _creditsWaiting: number = 0;

    private _messages: IMessageEvent[] = [];

    constructor(private _ngZone: NgZone)
    {
        this.registerMessages();

        this._lastOwnOffers = new AdvancedMap<number, MarketplaceOfferData>();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this._messages = [
                new MarketplaceOwnItemsEvent(this.onMarketplaceOwnItemsEvent.bind(this)),
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);

        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private onMarketplaceOwnItemsEvent(event: MarketplaceOwnItemsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._creditsWaiting = parser.creditsWaiting;

            for(const offer of parser.offers)
            {
                const data = new MarketplaceOfferData(offer.offerId, offer.furniId, offer.furniType, offer.extraData, offer.stuffData, offer.price, offer.status, offer._Str_3925);
                data._Str_5853 = offer._Str_5853;
                this._lastOwnOffers.add(offer.offerId, data);
            }
        });

    }

    public requestOwnItem(): void
    {
        Nitro.instance.communication.connection.send(new MarketplaceRequestOwnItemsComposer());
    }



    public get lastOwnOffers(): AdvancedMap<number, MarketplaceOfferData>
    {
        return this._lastOwnOffers;
    }

    public get creditsWaiting(): number
    {
        return this._creditsWaiting;
    }
}
