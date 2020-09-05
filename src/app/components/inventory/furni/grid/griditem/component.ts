import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { GroupItem } from '../../../items/GroupItem';
import { InventoryFurniService } from '../../../services/inventory.furni.service';

@Component({
    selector: '[nitro-inventory-furni-grid-item-component]',
    template: `
    <div class="nitro-inventory-furni-grid-item-component" [ngClass]="{ 'unseen': groupItem.unseen }" [ngStyle]="{ 'background-image': iconImage }" (click)="select()">
        <div class="badge badge-secondary" *ngIf="itemCount > 1">{{ itemCount }}</div>
    </div>`
})
export class InventoryFurniGridItemComponent implements OnInit
{
    @Input()
    public groupItem: GroupItem = null;

    constructor(
        private inventoryFurniService: InventoryFurniService,
        private changeDetectorRef: ChangeDetectorRef) {}

    public ngOnInit(): void
    {
        if(this.groupItem)
        {
            this.groupItem.view = this;
        }

        this.groupItem.init();
    }

    public ngOnDestroy(): void
    {
        if(this.groupItem) this.groupItem.view = null;
    }

    public select(): void
    {
        if(!this.groupItem) return;
        
        this.inventoryFurniService.selectGroupItem(this.groupItem);
    }

    public markForCheck(): void
    {
        this.changeDetectorRef.markForCheck();
    }

    public get iconImage(): string
    {
        const imageUrl = ((this.groupItem && this.groupItem.iconUrl) || null);

        if(imageUrl && (imageUrl !== '')) return `url('${ imageUrl }')`

        return null;
    }

    public get itemCount(): number
    {
        return this.groupItem.items.length;
    }
}