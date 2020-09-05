import { Component } from '@angular/core';
import { InventoryFurniService } from '../../services/inventory.furni.service';

@Component({
	selector: '[nitro-inventory-furni-search-component]',
    template: `
    <div class="nitro-inventory-furni-search-component">
        search
    </div>`
})
export class InventoryFurniSearchComponent
{
    constructor(
        private inventoryFurniService: InventoryFurniService) {}
}