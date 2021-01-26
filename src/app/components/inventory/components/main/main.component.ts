import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { RoomPreviewer } from '../../../../../client/nitro/room/preview/RoomPreviewer';
import { SettingsService } from '../../../../core/settings/service';
import { InventoryFurnitureService } from '../../services/furniture.service';
import { InventoryService } from '../../services/inventory.service';
import { InventoryTradingService } from '../../services/trading.service';

@Component({
    selector: 'nitro-inventory-main-component',
    templateUrl: './main.template.html'
})
export class InventoryMainComponent implements OnInit, OnDestroy, OnChanges
{
    @Input()
    public visible: boolean = false;

    private _roomPreviewer: RoomPreviewer = null;

    constructor(
        private _settingsService: SettingsService,
        private _inventoryService: InventoryService,
        private _inventoryFurnitureService: InventoryFurnitureService,
        private _inventoryTradingService: InventoryTradingService)
    {}

    public ngOnInit(): void
    {
        if(!this._roomPreviewer)
        {
            this._roomPreviewer = new RoomPreviewer(Nitro.instance.roomEngine, ++RoomPreviewer.PREVIEW_COUNTER);
        }

        this._inventoryService.controller = this;
    }

    public ngOnDestroy(): void
    {
        if(this._roomPreviewer)
        {
            this._roomPreviewer.dispose();
        }

        this._inventoryService.controller = null;
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.visible.previousValue;
        const next = changes.visible.currentValue;

        if(next !== prev)
        {
            if(next)
            {
                this.showFurniture();
            }
            else
            {
                this._inventoryTradingService.close();

                this.setAllFurnitureSeen();
            }
        }
    }

    public hide(): void
    {
        this._inventoryService.hideWindow();
    }

    public showFurniture(): void
    {
        this._inventoryService.furnitureVisible = true;
    }

    public updateItemLocking(): void
    {
        const itemIds: number[] = [];

        itemIds.push(...this._inventoryTradingService.getOwnTradingItemIds());

        if(!itemIds.length)
        {
            this._inventoryFurnitureService.unlockAllItems();

            return;
        }

        for(const item of this._inventoryFurnitureService.groupItems) item.lockItemIds(itemIds);
    }

    public setAllFurnitureSeen(): void
    {
        this._inventoryFurnitureService.setAllFurnitureSeen();
    }

    public get roomPreviewer(): RoomPreviewer
    {
        return this._roomPreviewer;
    }

    public get furnitureVisible(): boolean
    {
        return this._inventoryService.furnitureVisible;
    }

    public get tradingVisible(): boolean
    {
        return this._inventoryService.tradingVisible;
    }

    public get furnitureService(): InventoryFurnitureService
    {
        return this._inventoryFurnitureService;
    }

    public get tradeService(): InventoryTradingService
    {
        return this._inventoryTradingService;
    }
}