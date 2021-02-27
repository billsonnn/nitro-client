import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { AdvancedMap } from '../../../../../client/core/utils/AdvancedMap';
import { BotData } from '../../../../../client/nitro/communication/messages/parser/inventory/bots/BotData';
import { InventoryFurnitureService } from '../../services/furniture.service';
import { RoomPreviewer } from '../../../../../client/nitro/room/preview/RoomPreviewer';
import { InventorySharedComponent } from '../shared/inventory-shared.component';
import { Nitro } from '../../../../../client/nitro/Nitro';

@Component({
    selector: '[nitro-inventory-badges-component]',
    templateUrl: './badges.template.html'
})
export class InventoryBadgesComponent extends InventorySharedComponent implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = false;

    constructor(
        protected _inventoryService: InventoryService,
        protected _ngZone: NgZone,
        private _furniService: InventoryFurnitureService)
    {
        super(_inventoryService, _ngZone);
    }

    public ngOnInit(): void
    {
        this._inventoryService.badgesController = this;
    }

    public ngOnDestroy(): void
    {
        this._inventoryService.badgesController = null;
    }

    public get badges()
    {
        //
    }


}
