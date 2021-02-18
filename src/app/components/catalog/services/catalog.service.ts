import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { CatalogClubEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogClubEvent';
import { CatalogGiftConfigurationEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogGiftConfigurationEvent';
import { CatalogGiftUsernameUnavailableEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogGiftUsernameUnavailableEvent';
import { CatalogModeEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogModeEvent';
import { CatalogPageEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogPageEvent';
import { CatalogPagesEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogPagesEvent';
import { CatalogPurchaseEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogPurchaseEvent';
import { CatalogPurchaseFailedEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogPurchaseFailedEvent';
import { CatalogPurchaseUnavailableEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogPurchaseUnavailableEvent';
import { CatalogSearchEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogSearchEvent';
import { CatalogSoldOutEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogSoldOutEvent';
import { CatalogUpdatedEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogUpdatedEvent';
import { UserSubscriptionEvent } from '../../../../client/nitro/communication/messages/incoming/user/inventory/subscription/UserSubscriptionEvent';
import { CatalogModeComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogModeComposer';
import { CatalogPageComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogPageComposer';
import { CatalogPurchaseComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogPurchaseComposer';
import { CatalogPurchaseGiftComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogPurchaseGiftComposer';
import { CatalogRequestGiftConfigurationComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogRequestGiftConfigurationComposer';
import { CatalogRequestVipOffersComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogRequestVipOffersComposer';
import { CatalogRedeemVoucherComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/RedeemVoucherComposer';
import { CatalogPageParser } from '../../../../client/nitro/communication/messages/parser/catalog/CatalogPageParser';
import { CatalogClubOfferData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogClubOfferData';
import { CatalogPageData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageData';
import { CatalogPageOfferData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { CatalogProductOfferData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogProductOfferData';
import { UserSubscriptionParser } from '../../../../client/nitro/communication/messages/parser/user/inventory/subscription/UserSubscriptionParser';
import { Nitro } from '../../../../client/nitro/Nitro';
import { FurnitureType } from '../../../../client/nitro/session/furniture/FurnitureType';
import { IFurnitureData } from '../../../../client/nitro/session/furniture/IFurnitureData';
import { SettingsService } from '../../../core/settings/service';
import { NotificationService } from '../../notification/services/notification.service';
import { CatalogCustomizeGiftComponent } from '../components/customize-gift/customize-gift.component';
import { CatalogLayoutVipBuyComponent } from '../components/layouts/vip-buy/vip-buy.component';
import { CatalogMainComponent } from '../components/main/main.component';
import { GiftWrappingConfiguration } from '../gifts/gift-wrapping-configuration';
import { Purse } from '../purse/purse';
import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';

@Injectable()
export class CatalogService implements OnDestroy
{
    public static MODE_NORMAL: string = 'NORMAL';

    private _messages: IMessageEvent[] = [];
    private _component: CatalogMainComponent = null;
    private _giftConfiguratorComponent: CatalogCustomizeGiftComponent = null;
    private _catalogMode: number = -1;
    private _catalogRoot: CatalogPageData = null;
    private _activePage: CatalogPageParser = null;
    private _activePageData: CatalogPageData = null;
    private _manuallyCollapsed: CatalogPageData[] = [];
    private _isLoading: boolean = false;
    private _purse: Purse = new Purse();
    private _clubOffers: CatalogClubOfferData[] = [];
    private _vipTemplate: CatalogLayoutVipBuyComponent = null;
    private _giftWrappingConfiguration: GiftWrappingConfiguration = null;

    private _offersToRoots: AdvancedMap<number, CatalogPageData[]> = null;

    constructor(
        private _settingsService: SettingsService,
        private _notificationService: NotificationService,
        private _ngZone: NgZone)
    {
        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();

        this._vipTemplate = null;
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this._messages = [
                new CatalogClubEvent(this.onCatalogClubEvent.bind(this)),
                new CatalogModeEvent(this.onCatalogModeEvent.bind(this)),
                new CatalogPageEvent(this.onCatalogPageEvent.bind(this)),
                new CatalogPagesEvent(this.onCatalogPagesEvent.bind(this)),
                new CatalogPurchaseEvent(this.onCatalogPurchaseEvent.bind(this)),
                new CatalogPurchaseFailedEvent(this.onCatalogPurchaseFailedEvent.bind(this)),
                new CatalogPurchaseUnavailableEvent(this.onCatalogPurchaseUnavailableEvent.bind(this)),
                new CatalogSearchEvent(this.onCatalogSearchEvent.bind(this)),
                new CatalogSoldOutEvent(this.onCatalogSoldOutEvent.bind(this)),
                new CatalogUpdatedEvent(this.onCatalogUpdatedEvent.bind(this)),
                new UserSubscriptionEvent(this.onUserSubscriptionEvent.bind(this)),
                new CatalogGiftConfigurationEvent(this.onGiftConfigurationEvent.bind(this)),
                new CatalogGiftUsernameUnavailableEvent(this.onGiftUsernameUnavailableEvent.bind(this)),
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);

            Nitro.instance.communication.connection.send(new CatalogRequestGiftConfigurationComposer());
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

    private onCatalogClubEvent(event: CatalogClubEvent): void
    {
        if(!event || !event.getParser() || !this._vipTemplate) return;

        const offerFromEvent = event.getParser().offers;
        this._clubOffers = offerFromEvent;
        this._vipTemplate.setOffers(offerFromEvent);
    }

    public registerVipBuyTemplate(template: CatalogLayoutVipBuyComponent)
    {
        this._vipTemplate = template;
    }

    private onGiftConfigurationEvent(event: CatalogGiftConfigurationEvent): void
    {
        this._giftWrappingConfiguration = new GiftWrappingConfiguration(event);
    }

    private onGiftUsernameUnavailableEvent(event: CatalogGiftUsernameUnavailableEvent): void
    {
        this._giftConfiguratorComponent && this._giftConfiguratorComponent.showUsernameNotFoundDialog();
    }

    private onCatalogModeEvent(event: CatalogModeEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => (this._catalogMode = parser.mode));
    }

    private onCatalogPageEvent(event: CatalogPageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._activePage = parser;

            this._manuallyCollapsed = [];

            if(this._component) this._component.setupLayout();

            this._isLoading = false;
        });
    }

    private onCatalogPagesEvent(event: CatalogPagesEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._catalogRoot = parser.root;
            this.setOffersToNodes(this._catalogRoot);

            this._isLoading = false;

            (this._component && this._component.selectFirstTab());
        });
    }

    private onCatalogPurchaseEvent(event: CatalogPurchaseEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => (this._component && this._component.hidePurchaseConfirmation()));
    }

    private onCatalogPurchaseFailedEvent(event: CatalogPurchaseFailedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._notificationService.alert('${catalog.alert.purchaseerror.description.' + parser.code + '}', '${catalog.alert.purchaseerror.title}');

            (this._component && this._component.hidePurchaseConfirmation());
        });
    }

    private onCatalogPurchaseUnavailableEvent(event: CatalogPurchaseUnavailableEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onCatalogSearchEvent(event: CatalogSearchEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onCatalogSoldOutEvent(event: CatalogSoldOutEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onUserSubscriptionEvent(event: UserSubscriptionEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        // TODO: Is this even right? 1 day too less?
        this._purse.clubDays = Math.max(0, parser.days);
        this._purse.clubPeriods = Math.max(0, parser.months);
        this._purse.isVip = parser.isVip;
        this._purse.pastClubDays = parser.pastClubDays;
        this._purse.Str_14389 = parser.years == UserSubscriptionParser._Str_14729;
        this._purse.minutesUntilExpiration = parser.totalSeconds;
    }

    private onCatalogUpdatedEvent(event: CatalogUpdatedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._isLoading         = false;
            this._catalogMode       = -1;
            this._catalogRoot       = null;
            this._activePage        = null;
            this._activePageData    = null;

            if(this._component) this._component.reset();

            if(this._settingsService.catalogVisible)
            {
                this._component.hide();

                this._notificationService.alert('${catalog.alert.published.description}', '${catalog.alert.published.title}');
            }
        });
    }

    public setupCatalog(mode: string): void
    {
        if(!mode) return;

        this._isLoading         = true;
        this._catalogRoot       = null;
        this._activePage        = null;
        this._activePageData    = null;

        (this._component && this._component.reset());

        Nitro.instance.communication.connection.send(new CatalogModeComposer(mode));
    }

    public requestPage(page: CatalogPageData): void
    {
        if(!page || !this.canSelectPage(page)) return;

        this._activePageData = page;

        if(page.pageId === -1) return;

        this._isLoading = true;

        this.requestPageData(page.pageId, -1, CatalogService.MODE_NORMAL);
    }

    private requestPageData(pageId: number, offerId: number, catalogType: string): void
    {
        Nitro.instance.communication.connection.send(new CatalogPageComposer(pageId, offerId, catalogType));
    }

    public isDescendant(page: CatalogPageData, descendant: CatalogPageData): boolean
    {
        if(!page || !descendant) return false;

        if(page === descendant) return true;

        if(page.children.length)
        {
            for(const child of page.children)
            {
                if(!child) continue;

                if(child === descendant) return true;

                const flag = this.isDescendant(child, descendant);

                if(flag) return true;
            }
        }

        return false;
    }

    public getFurnitureDataForProductOffer(offer: CatalogProductOfferData): IFurnitureData
    {
        if(!offer) return null;

        let furniData: IFurnitureData = null;

        switch((offer.productType.toUpperCase()))
        {
            case FurnitureType.FLOOR:
                furniData = Nitro.instance.sessionDataManager.getFloorItemData(offer.furniClassId);
                break;
            case FurnitureType.WALL:
                furniData = Nitro.instance.sessionDataManager.getWallItemData(offer.furniClassId);
                break;
        }

        return furniData;
    }

    public getFurnitureDataIconUrl(furniData: IFurnitureData): string
    {
        if(!furniData) return null;

        const assetUrl = Nitro.instance.roomEngine.roomContentLoader.getAssetUrls(furniData.className, (furniData.colorIndex.toString()), true);

        return ((assetUrl && assetUrl[0]) || null);
    }

    public purchase(page: CatalogPageParser, offer: CatalogPageOfferData, quantity: number, extra: string = null): void
    {
        if(!page || !offer || !quantity) return;

        this.purchaseById(page.pageId, offer.offerId, quantity, extra);
    }

    public purchaseGiftOffer(activePage: CatalogPageParser, activeOffer: CatalogPageOfferData, extraData:string,  receiverName: string, giftMessage: string, spriteId: number, color: number, ribbonId: number, anonymousGift: boolean): void
    {
        Nitro.instance.communication.connection.send(new CatalogPurchaseGiftComposer(activePage.pageId, activeOffer.offerId, extraData, receiverName, giftMessage, spriteId, color, ribbonId, anonymousGift ));
    }

    public purchaseById(pageId: number, offerId: number, quantity: number, extra: string = null)
    {
        if(!pageId || !offerId || !quantity) return;
        Nitro.instance.communication.connection.send(new CatalogPurchaseComposer(pageId, offerId, extra, quantity));
    }

    public requestOffers(i: number): void
    {
        Nitro.instance.communication.connection.send(new CatalogRequestVipOffersComposer(i));
    }

    public redeemVoucher(voucherCode: string)
    {
        if(!voucherCode || voucherCode.trim().length === 0) return;

        Nitro.instance.communication.connection.send(new CatalogRedeemVoucherComposer(voucherCode));
    }

    public manuallyCollapsePage(page: CatalogPageData): void
    {
        const index = this._manuallyCollapsed.indexOf(page);

        if(index === -1) this._manuallyCollapsed.push(page);
        else this._manuallyCollapsed.splice(index, 1);
    }

    private canSelectPage(page: CatalogPageData): boolean
    {
        if(!page || !page.visible) return false;

        return true;
    }

    public get component(): CatalogMainComponent
    {
        return this._component;
    }

    public set component(component: CatalogMainComponent)
    {
        this._component = component;
    }

    public set giftConfiguratorComponent(component: CatalogCustomizeGiftComponent)
    {
        this._giftConfiguratorComponent = component;
    }

    public get catalogMode(): number
    {
        return this._catalogMode;
    }

    public get catalogRoot(): CatalogPageData
    {
        return this._catalogRoot;
    }

    public get activePage(): CatalogPageParser
    {
        return this._activePage;
    }

    public get activePageData(): CatalogPageData
    {
        return this._activePageData;
    }

    public get manuallyCollapsed(): CatalogPageData[]
    {
        return this._manuallyCollapsed;
    }

    public get purse(): Purse
    {
        return this._purse;
    }

    public get vipOffers(): CatalogClubOfferData[]
    {
        return this._clubOffers;
    }

    public get giftWrapperConfiguration(): GiftWrappingConfiguration
    {
        return this._giftWrappingConfiguration;
    }

    public hasOffer(offerId: number, arg2: boolean = false)
    {
        if(!this._catalogRoot) return;

        if(arg2)
        {
            const pages = [];
            if(!this._offersToRoots.hasKey(offerId))
            {
                return null;
            }

            const pagesForOffer = this._offersToRoots.getValue(offerId);
            for(const page of pagesForOffer)
            {
                if(page.visible)
                {
                    pages.push(page);
                }
            }

            if(pages.length > 0)
            {
                return pages;
            }

            return null;
        }

        return this._offersToRoots.getValue(offerId);
    }


    private setOffersToNodes(_catalogRoot: CatalogPageData)
    {
        if(!_catalogRoot) return;
        if(!this._offersToRoots) this._offersToRoots = new AdvancedMap<number, CatalogPageData[]>();


        if(_catalogRoot.offerIds && _catalogRoot.offerIds.length > 0)
        {
            for(const offerId of _catalogRoot.offerIds)
            {
                if(this._offersToRoots.hasKey(offerId))
                {
                    const offerIdData = this._offersToRoots.getValue(offerId);

                    if(!offerIdData.includes(_catalogRoot))
                    {
                        offerIdData.push(_catalogRoot);
                    }
                }
                else
                {
                    this._offersToRoots.add(offerId, [_catalogRoot]);
                }
            }
        }

        if(_catalogRoot.children && _catalogRoot.children.length > 0)
        {
            for(const child of _catalogRoot.children)
            {
                this.setOffersToNodes(child);
            }
        }
    }
}
