import { Injectable, NgZone, OnDestroy } from '@angular/core';
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
import { CatalogModeComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogModeComposer';
import { CatalogPageComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogPageComposer';
import { CatalogPurchaseComposer } from '../../../../client/nitro/communication/messages/outgoing/catalog/CatalogPurchaseComposer';
import { CatalogPageParser } from '../../../../client/nitro/communication/messages/parser/catalog/CatalogPageParser';
import { CatalogPageData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageData';
import { CatalogPageOfferData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { CatalogProductOfferData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogProductOfferData';
import { Nitro } from '../../../../client/nitro/Nitro';
import { FurnitureType } from '../../../../client/nitro/session/furniture/FurnitureType';
import { IFurnitureData } from '../../../../client/nitro/session/furniture/IFurnitureData';
import { SettingsService } from '../../../core/settings/service';
import { NotificationService } from '../../notification/services/notification.service';
import { CatalogMainComponent } from '../components/main/main.component';

@Injectable()
export class CatalogService implements OnDestroy
{
    public static MODE_NORMAL: string = 'NORMAL';

    private _messages: IMessageEvent[] = [];
    private _component: CatalogMainComponent = null;
    private _catalogMode: number = -1;
    private _catalogRoot: CatalogPageData = null;
    private _activePage: CatalogPageParser = null;
    private _activePageData: CatalogPageData = null;
    private _manuallyCollapsed: CatalogPageData[] = [];
    private _isLoading: boolean = false;

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
                new CatalogUpdatedEvent(this.onCatalogUpdatedEvent.bind(this))
            ];

            for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onCatalogClubEvent(event: CatalogClubEvent): void
    {
        console.log(event);
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
            for(let child of page.children)
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

        const assetUrl = Nitro.instance.roomEngine.roomContentLoader.getAssetUrls(furniData.className, (furniData.colorId.toString()), true);

        return ((assetUrl && assetUrl[0]) || null);
    }
    
    public purchase(page: CatalogPageParser, offer: CatalogPageOfferData, quantity: number, extra: string = null): void
    {
        if(!page || !offer || !quantity) return;

        Nitro.instance.communication.connection.send(new CatalogPurchaseComposer(page.pageId, offer.offerId, extra, quantity));
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
}