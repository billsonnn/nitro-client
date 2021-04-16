import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Nitro } from '../../../../client/nitro/Nitro';
import { MarketplaceRequestOwnItemsComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/marketplace/MarketplaceRequestOwnItemsComposer';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { MarketplaceOwnItemsEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/marketplace/MarketplaceOwnItemsEvent';
import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
import { MarketplaceOfferData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/MarketplaceOfferData';
import { FurnitureType } from '../../../../client/nitro/session/furniture/FurnitureType';
import { MarketplaceTakeItemBackComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/marketplace/MarketplaceTakeItemBackComposer';
import { MarketplaceCancelItemEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/marketplace/MarketplaceCancelItemEvent';
import { NotificationService } from '../../notification/services/notification.service';
import { MarketplaceRedeemCreditsComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/marketplace/MarketplaceRedeemCreditsComposer';
import { MarketplaceRequestOffersComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/marketplace/MarketplaceRequestOffersComposer';
import { MarketplaceOffersReceivedEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/marketplace/MarketplaceOffersReceivedEvent';
import { MarketplaceOfferItem } from '../../../../client/nitro/communication/messages/parser/catalog/utils/MarketplaceOfferItem';

@Injectable()
export class MarketplaceService implements OnDestroy
{

    public static _Str_20923:number = 1;
    public static _Str_15376:number = 1;
    public static _Str_8295:number = 2;
    public static _Str_6495:number = 3;


    private _lastOwnOffers: AdvancedMap<number, MarketplaceOfferData>;
    private _offerOnMarket: MarketplaceOfferItem[];
    private _totalOffersFound: number = 0;
    private _creditsWaiting: number = 0;

    private _messages: IMessageEvent[] = [];

    constructor(private _ngZone: NgZone,
        private _notificationService: NotificationService)
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
                new MarketplaceCancelItemEvent(this.onMarketplaceCancelItemEvent.bind(this)),
                new MarketplaceOffersReceivedEvent(this.onMarketplaceOffersReceivedEvent.bind(this)),
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

    private onMarketplaceOffersReceivedEvent(event: MarketplaceOffersReceivedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._totalOffersFound = parser.totalItemsFound;
            this._offerOnMarket = parser.offers;
        });


    }

    private onMarketplaceCancelItemEvent(event: MarketplaceCancelItemEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!parser.success)
        {
            this._notificationService.alert(Nitro.instance.localization.getValue('catalog.marketplace.cancel_failed'), Nitro.instance.localization.getValue('catalog.marketplace.operation_failed.topic'));
            return;
        }

        this._ngZone.run(() =>
        {
            this._lastOwnOffers.remove(parser.offerId);
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

    public get publicOffers(): MarketplaceOfferItem[]
    {
        return this._offerOnMarket;
    }

    public get totalOffersFound(): number
    {
        return this._totalOffersFound;
    }

    public get creditsWaiting(): number
    {
        return this._creditsWaiting;
    }

    public redeemExpiredMarketPlaceOffer(offerId: number)
    {
        Nitro.instance.communication.connection.send(new MarketplaceTakeItemBackComposer(offerId));
    }

    public redeemCredits(): void
    {
        const idsToDelete = [];

        for(const offer of this._lastOwnOffers.getValues())
        {
            if(offer.status === MarketplaceService._Str_8295)
            {
                idsToDelete.push(offer.offerId);
            }
        }

        for(const offerId of idsToDelete)
        {
            this._lastOwnOffers.remove(offerId);
        }

        Nitro.instance.communication.connection.send(new MarketplaceRedeemCreditsComposer());

    }

    public requestOffers(min: number, max: number, query: string, type: number): void
    {
        Nitro.instance.communication.connection.send(new MarketplaceRequestOffersComposer(min, max, query, type));
    }
}
