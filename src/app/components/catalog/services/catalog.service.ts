import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
import { CatalogClubEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogClubEvent';
import { CatalogClubGiftsEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogClubGiftsEvent';
import { CatalogGiftConfigurationEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogGiftConfigurationEvent';
import { CatalogGiftUsernameUnavailableEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogGiftUsernameUnavailableEvent';
import { CatalogGroupsEvent } from '../../../../client/nitro/communication/messages/incoming/catalog/CatalogGroupsEvent';
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
import { CatalogGroupsComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogGroupsComposer';
import { CatalogModeComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogModeComposer';
import { CatalogPageComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogPageComposer';
import { CatalogPurchaseComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogPurchaseComposer';
import { CatalogPurchaseGiftComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogPurchaseGiftComposer';
import { CatalogRequestGiftConfigurationComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogRequestGiftConfigurationComposer';
import { CatalogRequestVipGiftsComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogRequestVipGiftsComposer';
import { CatalogRequestVipOffersComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogRequestVipOffersComposer';
import { CatalogSearchComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogSearchComposer';
import { CatalogRedeemVoucherComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/RedeemVoucherComposer';
import { CatalogClubGiftsParser } from '../../../../client/nitro/communication/messages/parser/catalog/CatalogClubGiftsParser';
import { CatalogPageParser } from '../../../../client/nitro/communication/messages/parser/catalog/CatalogPageParser';
import { CatalogClubOfferData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogClubOfferData';
import { CatalogPageData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageData';
import { CatalogPageOfferData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { CatalogProductOfferData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogProductOfferData';
import { CatalogSearchData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogSearchData';
import { ICatalogPageData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/ICatalogPageData';
import { ICatalogPageParser } from '../../../../client/nitro/communication/messages/parser/catalog/utils/ICatalogPageParser';
import { UserSubscriptionParser } from '../../../../client/nitro/communication/messages/parser/user/inventory/subscription/UserSubscriptionParser';
import { Nitro } from '../../../../client/nitro/Nitro';
import { FurnitureType } from '../../../../client/nitro/session/furniture/FurnitureType';
import { IFurnitureData } from '../../../../client/nitro/session/furniture/IFurnitureData';
import { SettingsService } from '../../../core/settings/service';
import { NotificationService } from '../../notification/services/notification.service';
import { CatalogCustomizeGiftComponent } from '../components/customize-gift/customize-gift.component';
import { CatalogLayoutGuildCustomFurniComponent } from '../components/layouts/guild-custom-furni/guild-custom-furni.component';
import { SearchResultsPage } from '../components/layouts/search-results/SearchResultsPage';
import { CatalogLayoutVipBuyComponent } from '../components/layouts/vip-buy/vip-buy.component';
import { CatalogMainComponent } from '../components/main/main.component';
import { GiftWrappingConfiguration } from '../gifts/gift-wrapping-configuration';
import { Purse } from '../purse/purse';

@Injectable()
export class CatalogService implements OnDestroy
{
    public static MODE_NORMAL: string = 'NORMAL';

    private _messages: IMessageEvent[] = [];
    private _component: CatalogMainComponent = null;
    private _giftConfiguratorComponent: CatalogCustomizeGiftComponent = null;
    private _catalogMode: number = -1;
    private _catalogRoot: CatalogPageData = null;
    private _activePage: ICatalogPageParser = null;
    private _clubGiftsParser: CatalogClubGiftsParser = null;
    private _activePageData: ICatalogPageData = null;
    private _manuallyCollapsed: ICatalogPageData[] = [];
    private _isLoading: boolean = false;
    private _purse: Purse = new Purse();
    private _clubOffers: CatalogClubOfferData[] = [];
    private _vipTemplate: CatalogLayoutVipBuyComponent = null;
    private _groupFurniTemplate: CatalogLayoutGuildCustomFurniComponent = null;
    private _loaded: boolean = false;

    private _giftWrappingConfiguration: GiftWrappingConfiguration = null;

    private _offersToRoots: AdvancedMap<number, CatalogPageData[]> = null;
    private _searchResultsPages: CatalogSearchData;

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
        this._groupFurniTemplate = null;
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
                new CatalogGroupsEvent(this.onCatalogGroupsEvent.bind(this)),
                new UserSubscriptionEvent(this.onUserSubscriptionEvent.bind(this)),
                new UserSubscriptionEvent(this.onUserSubscriptionEvent.bind(this)),
                new CatalogGiftConfigurationEvent(this.onGiftConfigurationEvent.bind(this)),
                new CatalogGiftUsernameUnavailableEvent(this.onGiftUsernameUnavailableEvent.bind(this)),
                new CatalogClubGiftsEvent(this.onCatalogClubGiftsEvent.bind(this)),
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

    private onCatalogClubGiftsEvent(event: CatalogClubGiftsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._clubGiftsParser = parser;
    }

    public registerVipBuyTemplate(template: CatalogLayoutVipBuyComponent)
    {
        this._vipTemplate = template;
    }

    public registerGroupFurniTemplate(template: CatalogLayoutGuildCustomFurniComponent)
    {
        this._groupFurniTemplate = template;
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
        if(!(this._activePage instanceof SearchResultsPage)) return;

        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!parser.offer) return;

        this._ngZone.run(() => (this._component && this._component.selectOffer(parser.offer)));
    }

    private onCatalogSoldOutEvent(event: CatalogSoldOutEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onCatalogGroupsEvent(event: CatalogGroupsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._groupFurniTemplate.groups = parser.groups;
        });
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
        this._purse.pastClubDays = parser.pastVIPDays;
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

    public requestGroups(): void
    {
        Nitro.instance.communication.connection.send(new CatalogGroupsComposer());
    }

    public requestPage(page: ICatalogPageData): void
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

    public isDescendant(page: ICatalogPageData, descendant: ICatalogPageData): boolean
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

    public purchaseGiftOffer(activePage: ICatalogPageParser, activeOffer: CatalogPageOfferData, extraData:string,  receiverName: string, giftMessage: string, spriteId: number, color: number, ribbonId: number, anonymousGift: boolean): void
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

    public requestClubGifts(): void
    {
        Nitro.instance.communication.connection.send(new CatalogRequestVipGiftsComposer());
    }

    public redeemVoucher(voucherCode: string)
    {
        if(!voucherCode || voucherCode.trim().length === 0) return;

        Nitro.instance.communication.connection.send(new CatalogRedeemVoucherComposer(voucherCode));
    }

    public manuallyCollapsePage(page: ICatalogPageData): void
    {
        const index = this._manuallyCollapsed.indexOf(page);

        if(index === -1) this._manuallyCollapsed.push(page);
        else this._manuallyCollapsed.splice(index, 1);
    }

    private canSelectPage(page: ICatalogPageData): boolean
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

    public get activePage(): ICatalogPageParser
    {
        return this._activePage;
    }

    public get activePageData(): ICatalogPageData
    {
        return this._activePageData;
    }

    public get manuallyCollapsed(): ICatalogPageData[]
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

    public getOfferPages(offerId: number): CatalogPageData[]
    {
        if(!this._catalogRoot || !this._offersToRoots) return null;

        const pages = this._offersToRoots.getValue(offerId);

        if(!pages || !pages.length) return null;

        const allowedPages: CatalogPageData[] = [];

        for(const page of pages)
        {
            if(!page || !page.visible) continue;

            allowedPages.push(page);
        }

        if(!allowedPages.length) return null;

        return allowedPages;
    }

    private setOffersToNodes(pageData: CatalogPageData): void
    {
        if(!pageData) return;

        if(!this._offersToRoots) this._offersToRoots = new AdvancedMap<number, CatalogPageData[]>();

        if(pageData.offerIds && pageData.offerIds.length)
        {
            for(const offerId of pageData.offerIds)
            {
                let existing = this._offersToRoots.getValue(offerId);

                if(!existing)
                {
                    existing = [];

                    this._offersToRoots.add(offerId, existing);
                }

                if(existing.indexOf(pageData) >= 0) continue;

                existing.push(pageData);
            }
        }

        if(pageData.children && pageData.children.length)
        {
            for(const child of pageData.children) (child && this.setOffersToNodes(child));
        }
    }

    public setSearchPage(furni: IFurnitureData[]): void
    {
        const pages = new AdvancedMap<number, CatalogPageData>();

        for(const furniItem of furni)
        {
            const hasOffer      = this.getOfferPages(furniItem.purchaseOfferId);
            const hasRentOffer  = this.getOfferPages(furniItem.rentOfferId);

            const combinedOfferPages = [hasOffer, hasRentOffer];

            for(const offerSection of combinedOfferPages)
            {
                if(offerSection && offerSection.length > 0)
                {
                    for(const page of offerSection)
                    {
                        if(pages.hasKey(page.pageId)) continue;

                        pages.add(page.pageId, page);
                    }
                }
            }
        }

        this._searchResultsPages = new CatalogSearchData(pages.getValues());
        this._activePage = new SearchResultsPage(furni);
    }

    public requestOfferData(purchaseOfferId: number)
    {
        Nitro.instance.communication.connection.send(new CatalogSearchComposer(purchaseOfferId));
    }

    public get clubGiftsParser(): CatalogClubGiftsParser
    {
        return this._clubGiftsParser;
    }

    public hasClubDays(): boolean
    {
        if(!this._purse) return false;

        return this._purse.clubDays > 0;
    }

    public get searchResults(): ICatalogPageData
    {
        return this._searchResultsPages;
    }
}
