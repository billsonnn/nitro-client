import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { TradingAcceptEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/trading/TradingAcceptEvent';
import { TradingCloseEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/trading/TradingCloseEvent';
import { TradingCompletedEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/trading/TradingCompletedEvent';
import { TradingConfirmationEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/trading/TradingConfirmationEvent';
import { TradingListItem } from '../../../../client/nitro/communication/messages/incoming/inventory/trading/TradingListItem';
import { TradingListItemEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/trading/TradingListItemEvent';
import { TradingNotOpenEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/trading/TradingNotOpenEvent';
import { TradingOpenEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/trading/TradingOpenEvent';
import { TradingOpenFailedEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/trading/TradingOpenFailedEvent';
import { TradingOtherNotAllowedEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/trading/TradingOtherNotAllowedEvent';
import { TradingYouAreNotAllowedEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/trading/TradingYouAreNotAllowedEvent';
import { TradingCloseComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/trading/TradingCloseComposer';
import { TradingListAddItemsComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/trading/TradingListAddItemsComposer';
import { TradingOpenComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/trading/TradingOpenComposer';
import { TradingListItemParser } from '../../../../client/nitro/communication/messages/parser/inventory/trading/TradingListItemParser';
import { Nitro } from '../../../../client/nitro/Nitro';
import { SettingsService } from '../../../core/settings/service';
import { InventoryFurnitureService } from '../furniture/service';
import { FurniCategory } from '../items/FurniCategory';
import { FurnitureItem } from '../items/FurnitureItem';
import { GroupItem } from '../items/GroupItem';
import { InventoryService } from '../service';
import { InventoryTradingComponent } from './component';

@Injectable()
export class InventoryTradingService implements OnDestroy
{
    public static _Str_16036: number = 9;
    public static _Str_5529: number = 0;
    public static _Str_5536: number = 1;
    public static _Str_8223: number = 2;
    public static _Str_6408: number = 3;
    public static _Str_8721: number = 4;
    public static _Str_5869: number = 5;
    public static _Str_5812: number = 6;

    private _controller: InventoryTradingComponent = null;
    private _messages: IMessageEvent[] = [];

    private _state: number = 0;
    private _running: boolean = false;

    private _ownUserIndex: number = -1;
    private _ownUserName: string = '';
    private _ownUserItems: Map<string, GroupItem>;
    private _ownUserNumItems: number = 0;
    private _ownUserNumCredits: number = 0;
    private _ownUserAccepts: boolean = false;
    private _ownUserCanTrade: boolean = false;
    private _otherUserIndex: number = -1;
    private _otherUserName: string = '';
    private _otherUserItems: Map<string, GroupItem>;
    private _otherUserNumItems: number = 0;
    private _otherUserNumCredits: number = 0;
    private _otherUserAccepts: boolean = false;
    private _otherUserCanTrade: boolean = false;

    private _offeredItemIds: number[] = [];

    constructor(
        private _settingsService: SettingsService,
        private _inventoryService: InventoryService,
        private _inventoryFurnitureService: InventoryFurnitureService,
        private _ngZone: NgZone)
    {
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
            this._messages = [
                new TradingAcceptEvent(this.onTradingAcceptEvent.bind(this)),
                new TradingCloseEvent(this.onTradingCloseEvent.bind(this)),
                new TradingCompletedEvent(this.onTradingCompletedEvent.bind(this)),
                new TradingConfirmationEvent(this.onTradingConfirmationEvent.bind(this)),
                new TradingListItemEvent(this.onTradingListItemEvent.bind(this)),
                new TradingNotOpenEvent(this.onTradingNotOpenEvent.bind(this)),
                new TradingOpenEvent(this.onTradingOpenEvent.bind(this)),
                new TradingOpenFailedEvent(this.onTradingOpenFailedEvent.bind(this)),
                new TradingOtherNotAllowedEvent(this.onTradingOtherNotAllowedEvent.bind(this)),
                new TradingYouAreNotAllowedEvent(this.onTradingYouAreNotAllowedEvent.bind(this)),
            ];

            for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onTradingAcceptEvent(event: TradingAcceptEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(event._Str_4963 === this._ownUserIndex)
        {
            this._ownUserAccepts = event._Str_15794;
        }
        else
        {
            this._otherUserAccepts = event._Str_15794;
        }
    }

    private onTradingCloseEvent(event: TradingCloseEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this.close());
    }

    private onTradingCompletedEvent(event: TradingCompletedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this._state = InventoryTradingService._Str_5869);
    }

    private onTradingConfirmationEvent(event: TradingConfirmationEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this._state = InventoryTradingService._Str_8223);
    }

    private onTradingListItemEvent(event: TradingListItemEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
        
        this._ngZone.run(() =>
        {
            const firstUserItems: Map<string, GroupItem>    = new Map();
            const secondUserItems: Map<string, GroupItem>   = new Map();

            this.parseItems(parser._Str_17841, firstUserItems);
            this.parseItems(parser._Str_17465, secondUserItems);

            this.updateTrade(parser, firstUserItems, secondUserItems);
        });
    }

    private onTradingNotOpenEvent(event: TradingNotOpenEvent): void
    {
        console.log(event);
    }

    private onTradingOpenEvent(event: TradingOpenEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const sessionDataManager    = Nitro.instance.sessionDataManager;
        const roomSession           = this._inventoryService.roomSession;

        if(!sessionDataManager || !roomSession) return;

        let ownUserId = parser._Str_4963;
        
        const ownUserData = roomSession.userDataManager.getUserData(ownUserId);

        if(!ownUserData) return;

        let ownUserName     = ownUserData.name;
        let ownUserCanTrade = parser._Str_16764;
        let otherUserId     = parser._Str_17613;

        const otherUserData = roomSession.userDataManager.getUserData(otherUserId);

        if(!otherUserData) return;

        let otherUserName       = otherUserData.name;
        let otherUserCanTrade   = parser._Str_13374;

        if (otherUserId == sessionDataManager.userId)
        {
            let swapUserId = ownUserId;
            let swapUserName = ownUserName;
            let swapCanTrade = ownUserCanTrade;

            ownUserId           = otherUserId;
            ownUserName         = otherUserName;
            ownUserCanTrade     = otherUserCanTrade;
            otherUserId         = swapUserId;
            otherUserName       = swapUserName;
            otherUserCanTrade   = swapCanTrade;
        }

        this._ngZone.run(() =>
        {
            this._inventoryService.furnitureVisible = true;
            this._inventoryService.tradingVisible = true;
    
            this._settingsService.showInventory();

            this._Str_23457(ownUserId, ownUserName, ownUserCanTrade, otherUserId, otherUserName, otherUserCanTrade);
        });
    }

    private onTradingOpenFailedEvent(event: TradingOpenFailedEvent): void
    {
        console.log(event);
    }

    private onTradingOtherNotAllowedEvent(event: TradingOtherNotAllowedEvent): void
    {
        console.log(event);
    }

    private onTradingYouAreNotAllowedEvent(event: TradingYouAreNotAllowedEvent): void
    {
        console.log(event);
    }

    public close(): void
    {
        if(this._running)
        {
            if((this._state !== InventoryTradingService._Str_5529) && (this._state !== InventoryTradingService._Str_5869))
            {
                this.sendTradingCloseComposer();

                this._state = InventoryTradingService._Str_5812;
            }

            this._state     = InventoryTradingService._Str_5529;
            this._running   = false;

            this._inventoryService.tradingVisible = false;
        }
    }

    public startTrade(userId: number, userName: string)
    {
        if(!this._inventoryFurnitureService.isInitalized)
        {
            this._inventoryFurnitureService.requestLoad();
        }

        console.log(userId);

        this.sendTradingOpenComposer(userId);
    }

    public _Str_23457(k: number, _arg_2: string, _arg_3: boolean, _arg_4: number, _arg_5: string, _arg_6: boolean): void
    {
        this._ownUserIndex      = k;
        this._ownUserName       = _arg_2;
        this._ownUserItems      = new Map();
        this._ownUserAccepts    = false;
        this._ownUserCanTrade   = _arg_3;
        this._otherUserIndex    = _arg_4;
        this._otherUserName     = _arg_5;
        this._otherUserItems    = new Map();
        this._otherUserAccepts  = false;
        this._otherUserCanTrade = _arg_6;
        this._running           = true;
    }

    private parseItems(k: TradingListItem[], _arg_2: Map<string, GroupItem>): void
    {
        let totalItems = k.length;

        let i = 0;

        while(i < totalItems)
        {
            const item = k[i];

            if(item)
            {
                const spriteId  = item.spriteId;
                const category  = item.category;

                let name = (item.furniType + spriteId);

                if(!item.isGroupable || this.isExternalImage(spriteId))
                {
                    name = ('itemid' + item.itemId);
                }

                if(item.category === FurniCategory._Str_5186)
                {
                    name = (item.itemId + 'poster' + item.stuffData.getLegacyString());
                }

                else if(item.category === FurniCategory._Str_12454)
                {
                    name = '';
                }

                let groupItem = ((item.isGroupable && !this.isExternalImage(item.spriteId)) ? _arg_2.get(name) : null);

                if(!groupItem)
                {
                    groupItem = this._inventoryFurnitureService.createGroupItem(spriteId, category, item.stuffData);

                    _arg_2.set(name, groupItem);
                }

                groupItem.push(new FurnitureItem(item));
            }

            i++;
        }
    }

    private isExternalImage(spriteId: number): boolean
    {
        const furnitureData = Nitro.instance.sessionDataManager.getWallItemData(spriteId);

        return (furnitureData && furnitureData.isExternalImage);
    }

    private updateTrade(parser: TradingListItemParser, firstUserItems: Map<string, GroupItem>, secondUserItems: Map<string, GroupItem>): void
    {
        if(this._ownUserItems) this._ownUserItems.clear();
        if(this._otherUserItems) this._otherUserItems.clear();

        if(parser._Str_15162 === this._ownUserIndex)
        {
            this._ownUserItems          = firstUserItems;
            this._ownUserNumItems       = parser._Str_14946;
            this._ownUserNumCredits     = parser._Str_15709;
            this._otherUserItems        = secondUserItems;
            this._otherUserNumItems     = parser._Str_13801;
            this._otherUserNumCredits   = parser._Str_9138;
        }
        else
        {
            this._ownUserItems          = secondUserItems;
            this._ownUserNumItems       = parser._Str_13801;
            this._ownUserNumCredits     = parser._Str_9138;
            this._otherUserItems        = firstUserItems;
            this._otherUserNumItems     = parser._Str_14946;
            this._otherUserNumCredits   = parser._Str_15709;
        }

        this._ownUserAccepts    = false;
        this._otherUserAccepts  = false;
    }

    public offerGroupItem(groupItem: GroupItem, count: number = 1): void
    {
        if(!groupItem) return;

        const furnitureIds: number[] = [];
        const totalItems = groupItem.getTotalCount();

        let i = 0;

        while(i < totalItems)
        {
            if(furnitureIds.length === count) break;

            const furnitureItem = groupItem.getItemByIndex(i);

            if(furnitureItem)
            {
                if(this._offeredItemIds.indexOf(furnitureItem.id) === -1)
                {
                    if(!furnitureItem.locked)
                    {
                        furnitureItem.locked = true;

                        furnitureIds.push(furnitureItem.id);
                    }
                }
            }

            i++;
        }

        if(!furnitureIds.length) return;

        Nitro.instance.communication.connection.send(new TradingListAddItemsComposer(furnitureIds));
    }

    private sendTradingOpenComposer(userId: number): void
    {
        Nitro.instance.communication.connection.send(new TradingOpenComposer(userId));
    }

    private sendTradingCloseComposer(): void
    {
        Nitro.instance.communication.connection.send(new TradingCloseComposer());
    }

    public get controller(): InventoryTradingComponent
    {
        return this._controller;
    }

    public set controller(controller: InventoryTradingComponent)
    {
        this._controller = controller;
    }

    public get running(): boolean
    {
        return this._running;
    }

    public get ownUserName(): string
    {
        return this._ownUserName;
    }

    public get ownUserItems(): Map<string, GroupItem>
    {
        return this._ownUserItems;
    }

    public get ownUserNumItems(): number
    {
        return this._ownUserNumItems;
    }

    public get ownUserNumCredits(): number
    {
        return this._ownUserNumCredits;
    }

    public get ownUserAccepts(): boolean
    {
        return this._ownUserAccepts;
    }

    public get ownUserCanTrade(): boolean
    {
        return this._ownUserCanTrade;
    }

    public get otherUserName(): string
    {
        return this._otherUserName;
    }

    public get otherUserItems(): Map<string, GroupItem>
    {
        return this._otherUserItems;
    }

    public get otherUserNumItems(): number
    {
        return this._otherUserNumItems;
    }

    public get otherUserNumCredits(): number
    {
        return this._otherUserNumCredits;
    }

    public get otherUserAccepts(): boolean
    {
        return this._otherUserAccepts;
    }

    public get otherUserCanTrade(): boolean
    {
        return this._otherUserCanTrade;
    }
}