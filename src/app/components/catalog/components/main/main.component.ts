import { Component, ComponentRef, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { CatalogPageMessageOfferData, ClubOfferData, IFurnitureData, IObjectData, MarketplaceOffer, Nitro, NodeData, RoomPreviewer, Vector3d } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../core/settings/service';
import { PurseService } from '../../../purse/services/purse.service';
import { CatalogLayout } from '../../CatalogLayout';
import { CatalogLayoutFactory } from '../../CatalogLayoutFactory';
import { ICatalogPageData } from '../../common/ICatalogPageData';
import { ICatalogPageParser } from '../../common/ICatalogPageParser';
import { FurniCategory } from '../../enums/FurniCategory';
import { ProductTypeEnum } from '../../enums/ProductTypeEnum';
import { CatalogService } from '../../services/catalog.service';
import { MarketplaceService } from '../../services/marketplace.service';

@Component({
    selector: 'nitro-catalog-main-component',
    templateUrl: './main.template.html'
})
export class CatalogMainComponent implements OnInit, OnChanges, OnDestroy
{
    @Input()
    public visible: boolean = false;

    @ViewChild('layoutsContainer', { read: ViewContainerRef })
    public layoutsContainer: ViewContainerRef;

    private _roomPreviewer: RoomPreviewer = null;
    private _previewStuffData: IObjectData = null;
    private _lastComponent: ComponentRef<CatalogLayout> = null;
    private _layoutFactory: CatalogLayoutFactory = null;

    private _activeTab: NodeData = null;
    private _activeOffer: CatalogPageMessageOfferData = null;

    private _purchaseOfferPage: ICatalogPageParser = null;
    private _purchaseOffer: CatalogPageMessageOfferData = null;
    private _purchaseGiftOffer: CatalogPageMessageOfferData = null;
    private _purchaseVipSubscription: ClubOfferData = null;
    private _purchaseOfferQuantity: number = 1;
    private _purchaseOfferExtra: string = null;
    private _purchaseCompleted: boolean = false;
    private _showInsufficientFunds: boolean = false;
    private _showGiftConfigurator: boolean = false;

    constructor(
        private _settingsService: SettingsService,
        private _catalogService: CatalogService,
        private _marketplaceService: MarketplaceService,
        private _purseService: PurseService,
        private _ngZone: NgZone)
    {
        _catalogService.requestClubGifts();
    }

    public ngOnInit(): void
    {
        this._catalogService.component  = this;
        this._layoutFactory             = new CatalogLayoutFactory();

        if(!this._roomPreviewer)
        {
            this._roomPreviewer = new RoomPreviewer(Nitro.instance.roomEngine, ++RoomPreviewer.PREVIEW_COUNTER);
        }
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.visible.previousValue;
        const next = changes.visible.currentValue;

        if(next !== prev)
        {
            if(next)
            {
                this.prepareCatalog();
            }
            else
            {
                this.removeLastComponent();
            }
        }
    }

    public ngOnDestroy(): void
    {
        if(this._roomPreviewer)
        {
            this._roomPreviewer.dispose();
        }

        this.reset();

        this._catalogService.component  = null;
        this._layoutFactory             = null;
    }

    public reset(): void
    {
        this.removeLastComponent();

        this._activeTab     = null;
        this._activeOffer   = null;

        this.hidePurchaseConfirmation();
    }

    public hide(): void
    {
        this._settingsService.hideCatalog();
        this._catalogService.clearSearchResults();
    }

    public hidePurchaseConfirmation(): void
    {
        this._purchaseOfferPage     = null;
        this._purchaseOffer         = null;
        this._purchaseOfferQuantity = 1;
        this._purchaseOfferExtra    = null;
        this._purchaseVipSubscription = null;
        this._purchaseGiftOffer     = null;
        this._showGiftConfigurator = false;

    }

    private prepareCatalog(): void
    {
        if(!this._catalogService.catalogRoot)
        {
            this._catalogService.setupCatalog(CatalogService.MODE_NORMAL);

            return;
        }

        setTimeout(() =>
        {
            if(!this._activeTab)
            {
                this.selectFirstTab();
            }
            else
            {
                if(this._catalogService.activePage)
                {
                    this.setupLayout();
                }
                else
                {
                    this.selectFirstPage(this._activeTab);
                }
            }
        }, 0);
    }

    public setupLayout(): void
    {
        const activePage = this._catalogService.activePage;

        if(!activePage) return;

        const layoutType = this._layoutFactory.getLayoutForType(activePage.layoutCode);

        if(!layoutType)
        {
            this.removeLastComponent();

            return;
        }

        this.createComponent(layoutType);

        if(this._lastComponent)
        {
            this._lastComponent.instance.activePage = activePage;
        }

        this.selectOffer(null);
    }

    private createComponent(layoutType: typeof CatalogLayout): void
    {
        if(!layoutType || !this.layoutsContainer) return;

        this.removeLastComponent();

        this._lastComponent = this.layoutsContainer.createComponent(layoutType);
    }

    private removeLastComponent(): void
    {
        if(this.layoutsContainer) this.layoutsContainer.remove();

        this._lastComponent = null;
        this._activeOffer   = null;
    }

    public selectTab(tab: NodeData): void
    {
        if(!tab) return;

        this._activeTab = tab;

        this.selectFirstPage(tab);
    }

    public reselectCurrentTab(): void
    {
        this.selectFirstPage(this._activeTab);
    }

    public selectPage(page: ICatalogPageData): void
    {
        if(!page) return;

        this._catalogService.requestPage(page);
    }

    private selectFirstPage(page: NodeData, skipChildren: boolean = false): void
    {
        if(!page) return;

        if(!skipChildren && page.children.length)
        {
            this.selectPage((page.children && page.children[0]));

            return;
        }

        this.selectPage(page);

    }

    public selectFirstTab(): void
    {
        if(!this.catalogRoot) return;

        const child = (this.catalogRoot.children && this.catalogRoot.children[0]);

        if(child) this.selectTab(child);
    }

    public selectOffer(offer: CatalogPageMessageOfferData): void
    {
        this._activeOffer = offer;

        if(this._activeOffer)
        {
            const product = this._activeOffer.products[0];

            if(!product) return;

            if(!this._roomPreviewer) return;

            const furniData = this._catalogService.getFurnitureDataForProductOffer(product);

            if(!furniData && product.productType !== ProductTypeEnum.ROBOT) return;

            this._ngZone.runOutsideAngular(() =>
            {

                switch(product.productType)
                {
                    case ProductTypeEnum.ROBOT: {
                        this._roomPreviewer.updateObjectRoom('default', 'default', 'default');
                        const figure = Nitro.instance.avatar.getFigureStringWithFigureIds(product.extraParam, 'm', []);

                        this._roomPreviewer.addAvatarIntoRoom(figure, 0);
                    }
                        break;
                    case ProductTypeEnum.FLOOR:
                        this._roomPreviewer.updateObjectRoom('default', 'default', 'default');

                        if(furniData.specialType === FurniCategory.FIGURE_PURCHASABLE_SET)
                        {
                            const setIds: number[]  = [];
                            const sets              = furniData.customParams.split(',');

                            for(const set of sets)
                            {
                                const setId = parseInt(set);

                                if(Nitro.instance.avatar.isValidFigureSetForGender(setId, Nitro.instance.sessionDataManager.gender)) setIds.push(setId);
                            }

                            const figure = Nitro.instance.avatar.getFigureStringWithFigureIds(Nitro.instance.sessionDataManager.figure, Nitro.instance.sessionDataManager.gender, setIds);

                            this._roomPreviewer.addAvatarIntoRoom(figure, 0);
                        }
                        else
                        {
                            this._roomPreviewer.addFurnitureIntoRoom(product.furniClassId, new Vector3d(90), this._previewStuffData);
                        }
                        return;
                    case ProductTypeEnum.WALL:

                        switch(furniData.className)
                        {
                            case 'floor':
                                this._roomPreviewer.reset(false);
                                this._roomPreviewer.updateObjectRoom(product.extraParam);
                                break;
                            case 'wallpaper':
                                this._roomPreviewer.reset(false);
                                this._roomPreviewer.updateObjectRoom(null, product.extraParam);
                                break;
                            case 'landscape':
                                this._roomPreviewer.reset(false);
                                this._roomPreviewer.updateObjectRoom(null, null, product.extraParam);
                                break;
                            default:
                                this._roomPreviewer.updateObjectRoom('default', 'default', 'default');
                                this._roomPreviewer.addWallItemIntoRoom(product.furniClassId, new Vector3d(90), product.extraParam);
                                return;
                        }

                        // const windowData = Nitro.instance.sessionDataManager.getWallItemDataByName('ads_twi_windw');

                        // if(windowData)
                        // {
                        //     this._roomPreviewer.addWallItemIntoRoom(windowData.id, new Vector3d(90), windowData.customParams)
                        // }
                        return;
                }
            });
        }
        else
        {
            this._ngZone.runOutsideAngular(() => this._roomPreviewer && this._roomPreviewer.reset(false));
        }
    }

    private hasSufficientFunds(offerCredits: number, offerCurrencyType: number, offerCurrencyPoints: number, quantity: number = 1): boolean
    {
        if(!this._purseService) return false;

        const purseCurrencies = this._purseService.currencies;

        const currentCredits = purseCurrencies.get(-1);
        const currentCurrencyAmount = purseCurrencies.get(offerCurrencyType);

        const requiredCredits = offerCredits * quantity;
        const requiredCurrency = offerCurrencyPoints * quantity;

        if(currentCredits < requiredCredits || currentCurrencyAmount < requiredCurrency) return false;

        return true;
    }

    public confirmPurchase(page: ICatalogPageParser, offer: CatalogPageMessageOfferData, quantity: number = 1, extra: string = null, isGift: boolean = false): void
    {
        if(!this.hasSufficientFunds(offer.priceCredits, offer.priceActivityPointsType, offer.priceActivityPoints, quantity))
        {
            this.setInsufficientFunds(true);
            return;
        }

        this._purchaseOfferPage     = page;
        this._purchaseOffer         = offer;
        this._purchaseOfferQuantity = quantity;
        this._purchaseOfferExtra    = extra;
        if(isGift)
        {
            this._purchaseGiftOffer = offer;
        }
    }

    public confirmVipSubscription(subscription: ClubOfferData): void
    {
        if(!this.hasSufficientFunds(subscription.priceCredits, subscription.priceActivityPointsType, subscription.priceActivityPoints, 1))
        {
            this.setInsufficientFunds(true);
            return;
        }

        this._purchaseVipSubscription = subscription;
    }

    public get previewStuffData(): IObjectData
    {
        return this._previewStuffData;
    }

    public set previewStuffData(previewStuffData: IObjectData)
    {
        this._previewStuffData = previewStuffData;
    }

    public get roomPreviewer(): RoomPreviewer
    {
        return this._roomPreviewer;
    }

    public get catalogRoot(): NodeData
    {
        return this._catalogService.catalogRoot;
    }

    public get activeTab(): NodeData
    {
        return this._activeTab;
    }

    public get activeOffer(): CatalogPageMessageOfferData
    {
        return this._activeOffer;
    }

    public get activePage(): ICatalogPageParser
    {
        return this._catalogService.activePage;
    }

    public get activePageData(): ICatalogPageData
    {
        return this._catalogService.activePageData;
    }

    public get purchaseOfferPage(): ICatalogPageParser
    {
        return this._purchaseOfferPage;
    }

    public get purchaseOffer(): CatalogPageMessageOfferData
    {
        return this._purchaseOffer;
    }

    public get currentMarketplaceOfferToBuy(): MarketplaceOffer
    {
        return this._marketplaceService.currentMarketplaceOfferToBuy;
    }

    public get giftOffer(): CatalogPageMessageOfferData
    {
        return this._purchaseGiftOffer;
    }

    public get showGiftConfigurator(): boolean
    {
        return this._showGiftConfigurator;
    }

    public makeGiftConfiguratorVisible(): void
    {
        this._showGiftConfigurator = true;
    }

    public get purchaseOfferQuantity(): number
    {
        return this._purchaseOfferQuantity;
    }

    public get purchaseOfferExtra(): string
    {
        return this._purchaseOfferExtra;
    }

    public get purchaseCompleted(): boolean
    {
        return this._purchaseCompleted;
    }

    public get purchaseVipSubscription(): ClubOfferData
    {
        return this._purchaseVipSubscription;
    }

    public setInsufficientFunds(show: boolean): void
    {
        this._showInsufficientFunds = show;
    }

    public get showInsufficientFunds(): boolean
    {
        return this._showInsufficientFunds;
    }

    public handleSearchResults(foundFurni: IFurnitureData[])
    {
        this._catalogService.setSearchPage(foundFurni);

        this.setupLayout();

    }
}
