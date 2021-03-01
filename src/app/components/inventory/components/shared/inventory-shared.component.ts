import { InventoryService } from '../../services/inventory.service';
import { NgZone } from '@angular/core';

export class InventorySharedComponent
{
    constructor(protected _inventoryService: InventoryService,
                protected _ngZone: NgZone)
    {


    }

    public get canPlace(): boolean
    {
        return !!this._inventoryService.roomSession;
    }

    public get tradeRunning(): boolean
    {
        return this._inventoryService.controller.tradeService.running;
    }

    public attemptItemPlacement(): void
    {
        if(!this.canPlace || this.tradeRunning) return;

        this._ngZone.runOutsideAngular(() => this._inventoryService.controller.furnitureService.attemptItemPlacement());
    }

}
