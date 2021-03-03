import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
import { BotAddedToInventoryEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/bots/BotAddedToInventoryEvent';
import { BotInventoryMessageEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/bots/BotInventoryMessageEvent';
import { BotRemovedFromInventoryEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/bots/BotRemovedFromInventoryEvent';
import { GetBotInventoryComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/bots/GetBotInventoryComposer';
import { BotData } from '../../../../client/nitro/communication/messages/parser/inventory/bots/BotData';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomObjectPlacementSource } from '../../../../client/nitro/room/enums/RoomObjectPlacementSource';
import { RoomEngineObjectEvent } from '../../../../client/nitro/room/events/RoomEngineObjectEvent';
import { RoomEngineObjectPlacedEvent } from '../../../../client/nitro/room/events/RoomEngineObjectPlacedEvent';
import { RoomObjectCategory } from '../../../../client/nitro/room/object/RoomObjectCategory';
import { RoomObjectType } from '../../../../client/nitro/room/object/RoomObjectType';
import { InventoryMainComponent } from '../components/main/main.component';
import { BotItem } from '../items/BotItem';
import { UnseenItemCategory } from '../unseen/UnseenItemCategory';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryPetService implements OnDestroy
{
    public static INVENTORY_UPDATED: string             = 'IPS_INVENTORY_UPDATED';
    public static SELECT_FIRST_GROUP: string            = 'IPS_SELECT_FIRST_GROUP';
    public static SELECT_EXISTING_GROUP_DEFAULT: string = 'IPS_SELECT_EXISTING_GROUP_DEFAULT';

    private _messages: IMessageEvent[]          = [];
    private _pets: AdvancedMap<number, BotItem> = new AdvancedMap();
    private _petIdInPetPlacing: number          = -1;
    private _isObjectMoverRequested: boolean    = false;
    private _isInitialized: boolean             = false;
    private _needsUpdate: boolean               = false;

    constructor(
        private _inventoryService: InventoryService,
        private _ngZone: NgZone)
    {
        this.onRoomEngineObjectPlacedEvent = this.onRoomEngineObjectPlacedEvent.bind(this);

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.PLACED, this.onRoomEngineObjectPlacedEvent);

            this._messages = [
                new BotInventoryMessageEvent(this.onBotInventoryMessageEvent.bind(this)),
                new BotRemovedFromInventoryEvent(this.onBotRemovedFromInventoryEvent.bind(this)),
                new BotAddedToInventoryEvent(this.onBotAddedToInventoryEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.PLACED, this.onRoomEngineObjectPlacedEvent);

            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onRoomEngineObjectPlacedEvent(event: RoomEngineObjectPlacedEvent): void
    {
        if(!event) return;

        if(this._isObjectMoverRequested && event.type === RoomEngineObjectEvent.PLACED)
        {
            this._isObjectMoverRequested = false;

            if(!event._Str_4057)
            {
                this._ngZone.run(() => this._inventoryService.showWindow());
            }
        }
    }

    private onBotInventoryMessageEvent(event: BotInventoryMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            for(const botData of parser.items.values()) this.addSinglePetItem(botData);

            this._isInitialized = true;

            if(this._inventoryService.petsController) this._inventoryService.petsController.selectExistingGroupOrDefault();
        });
    }

    private onBotRemovedFromInventoryEvent(event: BotRemovedFromInventoryEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this.removeItemById(parser.itemId));
    }

    private onBotAddedToInventoryEvent(event: BotAddedToInventoryEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            const botItem = this.addSinglePetItem(parser.item);

            if(botItem) botItem.isUnseen = true;
        });
    }

    private getAllItemIds(): number[]
    {
        const itemIds: number[] = [];

        for(const botData of this._pets.getValues()) itemIds.push(botData.id);

        return itemIds;
    }

    public getPetItem(id: number): BotItem
    {
        const petItem = this._pets.getValue(id);

        if(!petItem) return null;

        return petItem;
    }

    private addSinglePetItem(botData: BotData): BotItem
    {
        if(!this._pets) this._pets = new AdvancedMap();

        const petItem   = new BotItem(botData);
        const unseen    = this.isPetUnseen(botData);

        if(unseen)
        {
            petItem.isUnseen = true;

            this.unshiftPetItem(petItem);
        }
        else
        {
            this.pushPetItem(petItem);
        }

        return petItem;
    }

    public removeItemById(id: number): BotItem
    {
        if(!this._pets.length) return null;

        const petItem = this._pets.remove(id);

        if(!petItem) return null;

        if(this._petIdInPetPlacing === petItem.id)
        {
            this.cancelRoomObjectPlacement();
            
            this._inventoryService.showWindow();
        }

        return petItem;
    }

    private isPetUnseen(item: BotData): boolean
    {
        let category = UnseenItemCategory.PET;

        return this._inventoryService.unseenTracker._Str_3613(category, item.id);
    }

    public setAllPetsSeen(): void
    {
        this._inventoryService.unseenTracker._Str_8813(UnseenItemCategory.PET);

        for(const petItem of this._pets.getValues())
        {
            if(petItem.isUnseen) petItem.isUnseen = false;
        }

        this._inventoryService.updateUnseenCount();
    }

    public attemptPetPlacement(flag: boolean = false): boolean
    {
        const petItem = this.getSelectedPet();

        if(!petItem) return false;

        const petData = petItem.botData;

        if(!petData) return false;

        const session = Nitro.instance.roomSessionManager.getSession(1);

        if(!session) return false;

        if(!session.isRoomOwner)
        {
            if(!session.allowPets) return false;
        }

        this._inventoryService.hideWindow();

        this.startRoomObjectPlacement(petData);

        return true;
    }

    private startRoomObjectPlacement(petData: BotData): void
    {
        let isMoving = Nitro.instance.roomEngine.processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, -(petData.id), RoomObjectCategory.UNIT, RoomObjectType.PET, petData.figure);

        if(isMoving)
        {
            this._petIdInPetPlacing = petData.id;

            this.setObjectMoverRequested(true);
        }
    }

    private cancelRoomObjectPlacement(): void
    {
        if(this._petIdInPetPlacing > -1)
        {
            Nitro.instance.roomEngine.cancelRoomObjectPlacement();

            this.setObjectMoverRequested(false);

            this._petIdInPetPlacing = -1;
        }
    }

    public getSelectedPet(): BotItem
    {
        for(const petITem of this._pets.getValues())
        {
            if(petITem && petITem.selected) return petITem;
        }

        return null;
    }

    private unshiftPetItem(petItem: BotItem): void
    {
        this._pets.unshift(petItem.id, petItem);
    }

    private pushPetItem(petItem: BotItem): void
    {
        this._pets.add(petItem.id, petItem);
    }

    private removePetItem(petItem: BotItem): void
    {
        this._pets.remove(petItem.id);
    }

    private removeAndUnshiftGroupitem(petItem: BotItem): void
    {
        this.removePetItem(petItem);
        this.unshiftPetItem(petItem);
    }

    public unselectAllPetItems(): void
    {
        for(const petItem of this._pets.getValues()) petItem.selected = false;
    }

    public requestLoad(): void
    {
        this._needsUpdate = false;

        Nitro.instance.communication.connection.send(new GetBotInventoryComposer());
    }

    private setObjectMoverRequested(flag: boolean)
    {
        if(this._isObjectMoverRequested === flag) return;

        this._ngZone.run(() => (this._isObjectMoverRequested = flag));
    }

    public get controller(): InventoryMainComponent
    {
        return this._inventoryService.controller;
    }

    public get isInitalized(): boolean
    {
        return this._isInitialized;
    }

    public get needsUpdate(): boolean
    {
        return this._needsUpdate;
    }

    public get pets(): BotItem[]
    {
        return this._pets.getValues();
    }

    public get isObjectMoverRequested(): boolean
    {
        return this._isObjectMoverRequested;
    }
}
