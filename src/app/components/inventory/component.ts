import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Nitro } from '../../../client/nitro/Nitro';
import { RoomPreviewer } from '../../../client/nitro/room/preview/RoomPreviewer';
import { SettingsService } from '../../core/settings/service';
import { InventoryFurnitureService } from './furniture/service';
import { InventoryService } from './service';
import { InventoryTradingService } from './trading/service';

@Component({
	selector: 'nitro-inventory-component',
    template: `
    <div *ngIf="visible" [bringToTop] [draggable] dragHandle=".card-header" class="card nitro-inventory-component">
        <div class="card-header">
            {{ ('inventory.title') | translate }}
            <button type="button" class="close" (click)="hide()"><i class="fas fa-times"></i></button>
        </div>
        <div class="card-body">
            <div class="btn-group w-100 mb-3">
                <button type="button" class="btn btn-secondary" [ngClass]="{ 'active': furnitureVisible || tradingVisible }">{{ 'inventory.furni' | translate }}</button>
            </div>
            <div nitro-inventory-furniture-component [visible]="furnitureVisible" [roomPreviewer]="roomPreviewer"></div>
            <div nitro-inventory-trading-component [visible]="tradingVisible"></div>
        </div>
    </div>`
})
export class InventoryComponent implements OnInit, OnDestroy, OnChanges
{
    @Input()
    public visible: boolean = false;

    private _roomPreviewer: RoomPreviewer = null;

    constructor(
        private _inventoryService: InventoryService,
        private _inventoryFurnitureService: InventoryFurnitureService,
        private _inventoryTradingService: InventoryTradingService,
        private _settingsService: SettingsService) {}

    public ngOnInit(): void
    {
        if(!this._roomPreviewer)
        {
            this._roomPreviewer = new RoomPreviewer(Nitro.instance.roomEngine, ++RoomPreviewer.PREVIEW_COUNTER);
        }
    }

    public ngOnDestroy(): void
    {
        if(this._roomPreviewer)
        {
            this._roomPreviewer.dispose();
        }
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.visible.previousValue;
        const next = changes.visible.currentValue;

        if(next && (prev !== next)) this.showFurniture();
    }

    public showFurniture(): void
    {        
        this._inventoryService.furnitureVisible = true;
    }

    public hide(): void
    {
        this._inventoryService.furnitureVisible = false;
        this._inventoryService.tradingVisible   = false;

        this._settingsService.hideInventory();
    }

    public get roomPreviewer(): RoomPreviewer
    {
        return this._roomPreviewer;
    }

    public get furnitureVisible(): boolean
    {
        return this._inventoryService.furnitureVisible;
    }

    public get tradingVisible(): boolean
    {
        return this._inventoryService.tradingVisible;
    }

    public get isObjectMoverRequested(): boolean
    {
        return this._inventoryFurnitureService.isObjectMoverRequested;
    }
}