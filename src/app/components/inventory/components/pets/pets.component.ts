import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
    selector: '[nitro-inventory-pets-component]',
    templateUrl: './pets.template.html'
})
export class InventoryPetsComponent implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = false;

    constructor(
        private _inventoryService: InventoryService,
        private _ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        this._inventoryService.petsController = this;
    }

    public ngOnDestroy(): void
    {
        this._inventoryService.petsController = null;
    }
}