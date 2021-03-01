import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { AdvancedMap } from '../../../../../client/core/utils/AdvancedMap';
import { BotData } from '../../../../../client/nitro/communication/messages/parser/inventory/bots/BotData';
import { InventoryFurnitureService } from '../../services/furniture.service';
import { RoomPreviewer } from '../../../../../client/nitro/room/preview/RoomPreviewer';
import { InventorySharedComponent } from '../shared/inventory-shared.component';
import { Nitro } from '../../../../../client/nitro/Nitro';

@Component({
    selector: '[nitro-inventory-bots-component]',
    templateUrl: './bots.template.html'
})
export class InventoryBotsComponent extends InventorySharedComponent implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = false;

    @Input()
    public roomPreviewer: RoomPreviewer = null;


    public selectedBot: BotData = null;

    constructor(
        protected _inventoryService: InventoryService,
        protected _ngZone: NgZone,
        private _furniService: InventoryFurnitureService)
    {
        super(_inventoryService, _ngZone);
    }

    public ngOnInit(): void
    {
        this._inventoryService.botsController = this;
    }

    public ngOnDestroy(): void
    {
        this._inventoryService.botsController = null;
    }

    public get bots(): AdvancedMap<number, BotData>
    {
        return this._furniService.getBots();
    }

    public get hasBots(): boolean
    {
        return this.bots && this.bots.length > 0;
    }

    public selectBot(bot: BotData)
    {
        this.selectedBot = bot;
        this.setRoomPreviewer();
    }

    private setRoomPreviewer(): void
    {

        if(!this.selectedBot) return;

        this._ngZone.runOutsideAngular(() =>
        {
            if(this.roomPreviewer)
            {
                this.roomPreviewer.updateObjectRoom('default', 'default', 'default');
                const figure = Nitro.instance.avatar.getFigureStringWithFigureIds(this.selectedBot.figure, this.selectedBot.gender, []);

                this.roomPreviewer.addAvatarIntoRoom(figure, 0);

            }
        });

    }

    public selectFirstBot(): void
    {
        if(this.bots.length > 0)
        {
            this.selectedBot = this.bots.getWithIndex(0);
            this.setRoomPreviewer();
        }
    }

    public attemptBotPlacement(): void
    {
        if(!this.canPlace || this.tradeRunning) return;

        this._ngZone.runOutsideAngular(() => this._inventoryService.controller.furnitureService.attemptBotPlacement(this.selectedBot));
    }


}
