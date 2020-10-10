import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SettingsService } from '../../core/settings/service';
import { InventoryFurnitureService } from './furniture/service';
import { InventoryService } from './service';
import { InventoryTradingService } from './trading/service';

@Component({
	selector: 'nitro-inventory-component',
    template: `
    <div *ngIf="visible" [bringToTop] [draggable] dragHandle=".card-header" class="card nitro-inventory-component">
        <div *ngIf="isLoading" class="card-loading-overlay"></div>
        <div class="card-header-container">
            <div class="card-header-overlay"></div>
            <div class="card-header">
                <div class="header-title">{{ ('inventory.title') | translate }}</div>
                <div class="header-close" (click)="hide()"><i class="fas fa-times"></i></div>
            </div>
            <div class="card-header-tabs">
                <div class="nav nav-tabs w-100 px-4">
                    <div class="nav-item nav-link" [ngClass]="{ 'active': furnitureVisible || tradingVisible }" (click)="showFurniture()">{{ 'inventory.furni' | translate }}</div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div nitro-inventory-furniture-component [visible]="furnitureVisible"></div>
            <div nitro-inventory-trading-component [visible]="tradingVisible"></div>
        </div>
    </div>`
})
export class InventoryComponent implements OnChanges
{
    @Input()
    public visible: boolean = false;

    constructor(
        private _inventoryService: InventoryService,
        private _inventoryFurnitureService: InventoryFurnitureService,
        private _inventoryTradingService: InventoryTradingService,
        private _settingsService: SettingsService) {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.visible.previousValue;
        const next = changes.visible.currentValue;

        if(next && (prev !== next))
        {
            this.showFurniture();
        }
    }

    private hideInventories(): void
    {
        this._inventoryService.furnitureVisible = false;
    }

    public showFurniture(): void
    {
        this.hideInventories();
        
        this._inventoryService.furnitureVisible = true;
    }

    public hide(): void
    {
        this._settingsService.hideInventory();
    }

    public get furnitureVisible(): boolean
    {
        return this._inventoryService.furnitureVisible;
    }

    public get tradingVisible(): boolean
    {
        return this._inventoryService.tradingVisible;
    }
}