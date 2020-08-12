import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { IMessageComposer } from '../../../client/core/communication/messages/IMessageComposer';
import { CatalogClubEvent } from '../../../client/nitro/communication/messages/incoming/catalog/CatalogClubEvent';
import { CatalogModeEvent } from '../../../client/nitro/communication/messages/incoming/catalog/CatalogModeEvent';
import { CatalogPageEvent } from '../../../client/nitro/communication/messages/incoming/catalog/CatalogPageEvent';
import { CatalogPagesEvent } from '../../../client/nitro/communication/messages/incoming/catalog/CatalogPagesEvent';
import { CatalogPurchaseEvent } from '../../../client/nitro/communication/messages/incoming/catalog/CatalogPurchaseEvent';
import { CatalogPurchaseFailedEvent } from '../../../client/nitro/communication/messages/incoming/catalog/CatalogPurchaseFailedEvent';
import { CatalogPurchaseUnavailableEvent } from '../../../client/nitro/communication/messages/incoming/catalog/CatalogPurchaseUnavailableEvent';
import { CatalogSearchEvent } from '../../../client/nitro/communication/messages/incoming/catalog/CatalogSearchEvent';
import { CatalogSoldOutEvent } from '../../../client/nitro/communication/messages/incoming/catalog/CatalogSoldOutEvent';
import { CatalogUpdatedEvent } from '../../../client/nitro/communication/messages/incoming/catalog/CatalogUpdatedEvent';
import { CatalogModeComposer } from '../../../client/nitro/communication/messages/outgoing/catalog/CatalogModeComposer';
import { CatalogPageData } from '../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageData';
import { Nitro } from '../../../client/nitro/Nitro';
import { SettingsService } from '../../core/settings/service';

@Component({
	selector: 'nitro-catalog-component',
    template: `
    <ng-container *ngIf="visible">
        <div [bringToTop] [draggable] dragHandle=".card-header" class="nitro-catalog-component">
            <div class="card">
                <div class="card-header">
                    <div class="header-title">Catalog</div>
                    <div class="header-close" (click)="hide()"><i class="fas fa-times"></i></div>
                </div>
                <div class="card-body">
                    <ng-container *ngIf="catalogRoot && (catalogRoot.children.length > 0)">
                        <ng-container *ngFor="let child of catalogRoot.children">
                            <button type="button" class="btn btn-primary">{{ child.localization }}</button>
                        </ng-container>
                    </ng-container>
                </div>
            </div>
        </div>
    </ng-container>`
})
export class CatalogComponent implements OnInit, OnDestroy
{
    public static NORMAL: string = 'NORMAL';

    public catalogMode: number = -1;
    public catalogRoot: CatalogPageData;
    public isModeRequested: boolean = false;

    constructor(
        private settingsService: SettingsService,
        private ngZone: NgZone) {}

    public ngOnInit(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.communication.registerMessageEvent(new CatalogClubEvent(this.onCatalogClubEvent.bind(this)));
            Nitro.instance.communication.registerMessageEvent(new CatalogModeEvent(this.onCatalogModeEvent.bind(this)));
            Nitro.instance.communication.registerMessageEvent(new CatalogPageEvent(this.onCatalogPageEvent.bind(this)));
            Nitro.instance.communication.registerMessageEvent(new CatalogPagesEvent(this.onCatalogPagesEvent.bind(this)));
            Nitro.instance.communication.registerMessageEvent(new CatalogPurchaseEvent(this.onCatalogPurchaseEvent.bind(this)));
            Nitro.instance.communication.registerMessageEvent(new CatalogPurchaseFailedEvent(this.onCatalogPurchaseFailedEvent.bind(this)));
            Nitro.instance.communication.registerMessageEvent(new CatalogPurchaseUnavailableEvent(this.onCatalogPurchaseUnavailableEvent.bind(this)));
            Nitro.instance.communication.registerMessageEvent(new CatalogSearchEvent(this.onCatalogSearchEvent.bind(this)));
            Nitro.instance.communication.registerMessageEvent(new CatalogSoldOutEvent(this.onCatalogSoldOutEvent.bind(this)));
            Nitro.instance.communication.registerMessageEvent(new CatalogUpdatedEvent(this.onCatalogUpdatedEvent.bind(this)));
        });
    }

    public ngOnDestroy(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            
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

        console.log(parser);

        this.catalogMode = parser.mode;
    }

    private onCatalogPageEvent(event: CatalogPageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onCatalogPagesEvent(event: CatalogPagesEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this.ngZone.run(() => this.catalogRoot = parser.root);
    }

    private onCatalogPurchaseEvent(event: CatalogPurchaseEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onCatalogPurchaseFailedEvent(event: CatalogPurchaseFailedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
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
    }

    public setCatalogMode(mode: string): void
    {
        if(!mode) return;

        this.isModeRequested = true;

        this.send(new CatalogModeComposer(mode));
    }

    public requestPage(pageId: number, offerId: number, catalogType: string): void
    {
        
    }

    private send(composer: IMessageComposer): void
    {
        if(!composer) return;

        Nitro.instance.communication.connection.send(composer);
    }

    public hide(): void
    {
        this.settingsService.hideCatalog();
    }

    public get visible(): boolean
    {
        const visible = this.settingsService.catalogVisible;

        if(visible)
        {
            if(!this.isModeRequested)
            {
                this.setCatalogMode(CatalogComponent.NORMAL);
            }
        }

        return visible;
    }
}