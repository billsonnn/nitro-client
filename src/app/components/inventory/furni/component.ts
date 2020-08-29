import { Component } from '@angular/core';
import { IInventoryComponent } from '../IInventoryComponent';
import { InventoryService } from '../services/inventory.service';

@Component({
	selector: '[nitro-inventory-furni-component]',
    template: `
    <ng-container *ngIf="visible">
        <div class="nitro-inventory-furni-component">
            furni here
        </div>
    </ng-container>`
})
export class InventoryFurniComponent implements IInventoryComponent
{
    constructor(
        private inventoryService: InventoryService) {}

    public requestInitialization(): void
    {

    }

    public get visible(): boolean
    {
        return true;
    }
}