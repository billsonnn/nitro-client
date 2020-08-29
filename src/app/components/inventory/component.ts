import { ChangeDetectorRef, Component, ComponentFactoryResolver, Input, NgZone } from '@angular/core';
import { SettingsService } from '../../core/settings/service';
import { InventoryService } from './services/inventory.service';

@Component({
	selector: 'nitro-inventory-component',
    template: `
    <ng-container *ngIf="visible">
        <div [bringToTop] [draggable] dragHandle=".card-header" class="nitro-inventory-component">
            <div class="card">
                <div class="card-header">
                    <div class="header-title">Inventory</div>
                    <div class="header-close" (click)="hide()"><i class="fas fa-times"></i></div>
                </div>
                <div class="card-body">
                    <div nitro-inventory-furni-component></div>
                </div>
            </div>
        </div>
    </ng-container>`
})
export class InventoryComponent
{
    @Input()
    public visible: boolean = false;

    constructor(
        private settingsService: SettingsService,
        private inventoryService: InventoryService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef,
        private ngZone: NgZone) {}

    public hide(): void
    {
        this.settingsService.hideInventory();
    }
}