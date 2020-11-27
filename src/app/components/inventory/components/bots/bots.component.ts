import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
    selector: '[nitro-inventory-bots-component]',
    templateUrl: './bots.template.html'
})
export class InventoryBotsComponent implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = false;

    constructor(
        private _inventoryService: InventoryService,
        private _ngZone: NgZone) {}

    public ngOnInit(): void
    {
        this._inventoryService.botsController = this;
    }

    public ngOnDestroy(): void
    {
        this._inventoryService.botsController = null;
    }
}