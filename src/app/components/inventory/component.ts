import { ChangeDetectorRef, Component, ComponentFactoryResolver, Input, NgZone, OnInit } from '@angular/core';
import { Nitro } from '../../../client/nitro/Nitro';
import { RoomPreviewer } from '../../../client/nitro/room/preview/RoomPreviewer';
import { SettingsService } from '../../core/settings/service';
import { RoomPreviewComponent } from '../../shared/components/roompreview/component';
import { InventoryFurniService } from './services/inventory.furni.service';
import { InventoryService } from './services/inventory.service';

@Component({
	selector: 'nitro-inventory-component',
    template: `
    <div *ngIf="visible" [bringToTop] [draggable] dragHandle=".card-header" class="card nitro-inventory-component">
        <div *ngIf="isLoading" class="loading-overlay"></div>
        <div class="inventory-header">
            <div class="header-overlay"></div>
            <div class="card-header">
                <div class="header-title">Inventory</div>
                <div class="header-close" (click)="hide()"><i class="fas fa-times"></i></div>
            </div>
            <div class="header-tabs">
                <div class="nav nav-tabs w-100 px-4">
                    <div class="nav-item nav-link" [ngClass]="{ 'active': furniVisible }">Furniture</div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="w-100" nitro-inventory-furni-component [visible]="furniVisible" [roomPreviewer]="roomPreviewer"></div>
        </div>
    </div>`
})
export class InventoryComponent implements OnInit
{
    @Input()
    public visible: boolean = false;

    public furniVisible: boolean = true;
    public roomPreviewer: RoomPreviewer = null;

    constructor(
        private settingsService: SettingsService,
        private inventoryService: InventoryService,
        private inventoryFurniService: InventoryFurniService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef,
        private ngZone: NgZone) {}

    public ngOnInit(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            if(!this.roomPreviewer)
            {
                this.roomPreviewer = new RoomPreviewer(Nitro.instance.roomEngine, ++RoomPreviewComponent.PREVIEW_COUNTER);
            }
        })
    }

    public hide(): void
    {
        this.settingsService.hideInventory();
    }
}