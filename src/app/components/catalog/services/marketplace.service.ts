import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from 'nitro-renderer/src/core/communication/messages/IMessageEvent';
import { AdvancedMap } from 'nitro-renderer/src/core/utils/AdvancedMap';
import { MarketplaceAfterOrderStatusEvent } from 'nitro-renderer/src/nitro/communication/messages/incoming/catalog/marketplace/MarketplaceAfterOrderStatusEvent';
import { MarketplaceCancelItemEvent } from 'nitro-renderer/src/nitro/communication/messages/incoming/catalog/marketplace/MarketplaceCancelItemEvent';
import { MarketplaceOffersReceivedEvent } from 'nitro-renderer/src/nitro/communication/messages/incoming/catalog/marketplace/MarketplaceOffersReceivedEvent';
import { MarketplaceOwnItemsEvent } from 'nitro-renderer/src/nitro/communication/messages/incoming/catalog/marketplace/MarketplaceOwnItemsEvent';
import { MarketplaceBuyOfferComposer } from 'nitro-renderer/src/nitro/communication/messages/outgoing/catalog/marketplace/MarketplaceBuyOfferComposer';
import { MarketplaceRedeemCreditsComposer } from 'nitro-renderer/src/nitro/communication/messages/outgoing/catalog/marketplace/MarketplaceRedeemCreditsComposer';
import { MarketplaceRequestOffersComposer } from 'nitro-renderer/src/nitro/communication/messages/outgoing/catalog/marketplace/MarketplaceRequestOffersComposer';
import { MarketplaceRequestOwnItemsComposer } from 'nitro-renderer/src/nitro/communication/messages/outgoing/catalog/marketplace/MarketplaceRequestOwnItemsComposer';
import { MarketplaceTakeItemBackComposer } from 'nitro-renderer/src/nitro/communication/messages/outgoing/catalog/marketplace/MarketplaceTakeItemBackComposer';
import { MarketplaceOfferData } from 'nitro-renderer/src/nitro/communication/messages/parser/catalog/utils/MarketplaceOfferData';
import { MarketplaceOfferItem } from 'nitro-renderer/src/nitro/communication/messages/parser/catalog/utils/MarketplaceOfferItem';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { NotificationService } from '../../notification/services/notification.service';
import { IMarketplaceSearchOptions } from '../components/layouts/marketplace/marketplace/sub/advanced.component';

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
    private _lastSearchRequest: IMarketplaceSearchOptions = null;
    private _activeOfferToBuy: MarketplaceOfferItem = null;

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
                new MarketplaceAfterOrderStatusEvent(this.onMarketplaceAfterOrderStatusEvent.bind(this)),
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

    private onMarketplaceAfterOrderStatusEvent(event: MarketplaceAfterOrderStatusEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(parser.result == 1 && this._lastSearchRequest)
        {
            this.requestOffers(this._lastSearchRequest);
            return;
        }

        if(parser.result == 2)
        {
            const offerId = parser._Str_7501;
            const nonRemovedOffers = [];
            for(const offer of this._offerOnMarket)
            {
                if(!(offer.offerId == offerId))
                {
                    nonRemovedOffers.push(offer);
                }
            }

            this._ngZone.run(() => this._offerOnMarket = nonRemovedOffers);

            this._notificationService.alert(
                Nitro.instance.localization.getValue('catalog.marketplace.not_available_header'),
                Nitro.instance.localization.getValue('catalog.marketplace.not_available_title')
            );

            return;
        }

        if(parser.result == 3 && this._lastSearchRequest)
        {
            // Flash code doesn't make sense.
            // Just refresh the list and move on.
            this.requestOffers(this._lastSearchRequest);
            return;
        }

        if(parser.result == 4)
        {
            this._notificationService.alert(
                Nitro.instance.localization.getValue('catalog.alert.notenough.credits.description'),
                Nitro.instance.localization.getValue('catalog.alert.notenough.title')
            );
            return;
        }
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

    public requestOffers(values: IMarketplaceSearchOptions): void
    {
        this._lastSearchRequest = values;
        Nitro.instance.communication.connection.send(new MarketplaceRequestOffersComposer(values.minPrice, values.maxPrice, values.query, values.type));
    }

    public buyOffer(offer: MarketplaceOfferItem): void
    {
        this._activeOfferToBuy = offer;
    }

    public get currentMarketplaceOfferToBuy(): MarketplaceOfferItem
    {
        return this._activeOfferToBuy;
    }

    public buyMarketplaceOffer(offerId: number): void
    {
        this._activeOfferToBuy = null;
        Nitro.instance.communication.connection.send(new MarketplaceBuyOfferComposer(offerId));
    }
}
