import { Component, Input } from '@angular/core';
import { GroupItem } from '../../items/GroupItem';

@Component({
    selector: '[nitro-inventory-furni-grid-component]',
    template: `
    <div class="nitro-inventory-furni-grid-component">
        <div class="grid-items">
            <div class="item-detail" nitro-inventory-furni-grid-item-component *ngFor="let groupItem of groupItems" [groupItem]="groupItem"></div>
        </div>
    </div>`
})
export class InventoryFurniGridComponent
{
    @Input()
    public groupItems: GroupItem[] = [];
}