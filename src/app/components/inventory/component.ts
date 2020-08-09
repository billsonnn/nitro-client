import { Component } from '@angular/core';
import { SettingsService } from '../../core/settings/service';

@Component({
	selector: 'nitro-inventory-component',
    template: `
    <ng-container *ngIf="visible">
        <div [bringToTop] [draggable] dragHandle=".card-header" class="nitro-catalog-component">
            <div class="card">
                <div class="card-header">
                    <div class="header-title">Inventory</div>
                    <div class="header-close" (click)="hide()"><i class="fas fa-times"></i></div>
                </div>
                <div class="card-body">
                    inventory content
                </div>
            </div>
        </div>
    </ng-container>`
})
export class InventoryComponent
{
    constructor(
        private settingsService: SettingsService) {}

    public hide(): void
    {
        this.settingsService.hideInventory();
    }

    public get visible(): boolean
    {
        return this.settingsService.inventoryVisible;
    }
}