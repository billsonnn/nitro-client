import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
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
import { TradingAcceptComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/trading/TradingAcceptComposer';
import { TradingCancelComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/trading/TradingCancelComposer';
import { TradingCloseComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/trading/TradingCloseComposer';
import { TradingConfirmationComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/trading/TradingConfirmationComposer';
import { TradingListAddItemComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/trading/TradingListAddItemComposer';
import { TradingListAddItemsComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/trading/TradingListAddItemsComposer';
import { TradingListItemRemoveComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/trading/TradingListRemoveItemComposer';
import { TradingOpenComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/trading/TradingOpenComposer';
import { TradingUnacceptComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/trading/TradingUnacceptComposer';
import { TradingCloseParser } from '../../../../client/nitro/communication/messages/parser/inventory/trading/TradingCloseParser';
import { TradingListItemParser } from '../../../../client/nitro/communication/messages/parser/inventory/trading/TradingListItemParser';
import { TradingOpenFailedParser } from '../../../../client/nitro/communication/messages/parser/inventory/trading/TradingOpenFailedParser';
import { Nitro } from '../../../../client/nitro/Nitro';
import { IObjectData } from '../../../../client/nitro/room/object/data/IObjectData';
import { StringDataType } from '../../../../client/nitro/room/object/data/type/StringDataType';
import { NotificationService } from '../../notification/services/notification.service';
import { InventoryMainComponent } from '../components/main/main.component';
import { InventoryTradingComponent } from '../components/trading/trading.component';
import { FurniCategory } from '../items/FurniCategory';
import { FurnitureItem } from '../items/FurnitureItem';
import { GroupItem } from '../items/GroupItem';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryTradingService implements OnDestroy
{
    public static MAX_ITEMS_TO_TRADE: number        = 9;
    public static TRADING_STATE_READY: number       = 0;
    public static TRADING_STATE_RUNNING: number     = 1;
    public static TRADING_STATE_COUNTDOWN: number   = 2;
    public static TRADING_STATE_CONFIRMING: number  = 3;
    public static TRADING_STATE_CONFIRMED: number   = 4;
    public static TRADING_STATE_COMPLETED: number   = 5;
    public static TRADING_STATE_CANCELLED: number   = 6;

    private _messages: IMessageEvent[] = [];

    private _state: number = 0;
    private _running: boolean = false;

    private _ownUserIndex: number = -1;
    private _ownUserName: string = '';
    private _ownUserItems: AdvancedMap<string, GroupItem>;
    private _ownUserNumItems: number = 0;
    private _ownUserNumCredits: number = 0;
    private _ownUserAccepts: boolean = false;
    private _ownUserCanTrade: boolean = false;
    private _otherUserIndex: number = -1;
    private _otherUserName: string = '';
    private _otherUserItems: AdvancedMap<string, GroupItem>;
    private _otherUserNumItems: number = 0;
    private _otherUserNumCredits: number = 0;
    private _otherUserAccepts: boolean = false;
    private _otherUserCanTrade: boolean = false;

    private _offeredItemIds: number[] = [];

    constructor(
        private _notificationService: NotificationService,
        private _inventoryService: InventoryService,
        private _ngZone: NgZone)
    {
        this.registerMessages();
    }

    public static _Str_16998(spriteId: number, stuffData: IObjectData): string
    {
        let _local_3 = spriteId.toString();
        const _local_4 = (stuffData as StringDataType);

        if(!(stuffData instanceof StringDataType)) return _local_3;

        let _local_5 = 1;

        while(_local_5 < 5)
        {
            _local_3 = (_local_3 + (',' + _local_4.getValue(_local_5)));

            _local_5++;
        }

        return _local_3;
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

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onTradingAcceptEvent(event: TradingAcceptEvent): void
    {
        if(!event) return;

        console.log(event);

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            if(event._Str_4963 === this._ownUserIndex)
            {
                this._ownUserAccepts = event._Str_15794;
            }
            else
            {
                this._otherUserAccepts = event._Str_15794;
            }
        });
    }

    private tradingNotificationMessage(type: number): void
    {
        switch(type)
        {
            case InventoryTradingComponent.ALERT_SCAM:
                this._notificationService.alert('${inventory.trading.warning.other_not_offering}', '${inventory.trading.notification.title}');
                return;
            case InventoryTradingComponent.ALERT_OTHER_CANCELLED:
                this._notificationService.alert('${inventory.trading.info.closed}', '${inventory.trading.notification.title}');
                return;
            case InventoryTradingComponent.ALERT_ALREADY_OPEN:
                this._notificationService.alert('${inventory.trading.info.already_open}', '${inventory.trading.notification.title}');
                return;
        }
    }

    private onTradingCloseEvent(event: TradingCloseEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!this._running) return;

        this._ngZone.run(() =>
        {
            if(parser.reason === TradingCloseParser._Str_16410)
            {
                this._notificationService.alert('${inventory.trading.notification.caption}, ${inventory.trading.notification.commiterror.info}', '${inventory.trading.notification.title}');
            }
            else
            {
                if(parser._Str_4963 !== this._ownUserIndex)
                {
                    this.tradingNotificationMessage(InventoryTradingComponent.ALERT_OTHER_CANCELLED);
                }
            }

            this.close();
        });
    }

    private onTradingCompletedEvent(event: TradingCompletedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => (this.state = InventoryTradingService.TRADING_STATE_COMPLETED));
    }

    private onTradingConfirmationEvent(event: TradingConfirmationEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => (this.state = InventoryTradingService.TRADING_STATE_COUNTDOWN));
    }

    private onTradingListItemEvent(event: TradingListItemEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            const firstUserItems: AdvancedMap<string, GroupItem>    = new AdvancedMap();
            const secondUserItems: AdvancedMap<string, GroupItem>   = new AdvancedMap();

            this.parseItems(parser._Str_17841, firstUserItems);
            this.parseItems(parser._Str_17465, secondUserItems);

            this.updateTrade(parser, firstUserItems, secondUserItems);
        });
    }

    private onTradingNotOpenEvent(event: TradingNotOpenEvent): void
    {
        if(!event) return;
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

        if(otherUserId === sessionDataManager.userId)
        {
            const swapUserId = ownUserId;
            const swapUserName = ownUserName;
            const swapCanTrade = ownUserCanTrade;

            ownUserId           = otherUserId;
            ownUserName         = otherUserName;
            ownUserCanTrade     = otherUserCanTrade;
            otherUserId         = swapUserId;
            otherUserName       = swapUserName;
            otherUserCanTrade   = swapCanTrade;
        }

        this._ngZone.run(() =>
        {
            this._inventoryService.showWindow();

            this._inventoryService.furnitureVisible = true;
            this._inventoryService.tradingVisible   = true;

            this._Str_23457(ownUserId, ownUserName, ownUserCanTrade, otherUserId, otherUserName, otherUserCanTrade);
        });
    }

    private onTradingOpenFailedEvent(event: TradingOpenFailedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if((parser.reason === TradingOpenFailedParser._Str_18150) || (parser.reason === TradingOpenFailedParser._Str_18383))
        {
            this._ngZone.run(() =>
            {
                this.tradingNotificationMessage(InventoryTradingComponent.ALERT_ALREADY_OPEN);
            });
        }
    }

    private onTradingOtherNotAllowedEvent(event: TradingOtherNotAllowedEvent): void
    {
        if(!event) return;

        this._ngZone.run(() =>
        {
            this._notificationService.alert('${inventory.trading.warning.others_account_disabled}', '${inventory.trading.notification.title}');
        });
    }

    private onTradingYouAreNotAllowedEvent(event: TradingYouAreNotAllowedEvent): void
    {
        if(!event) return;

        this._ngZone.run(() =>
        {
            this._notificationService.alert('${inventory.trading.warning.own_account_disabled}', '${inventory.trading.notification.title}');
        });
    }

    public close(): void
    {
        if(this._running)
        {
            if((this._state !== InventoryTradingService.TRADING_STATE_READY) && (this._state !== InventoryTradingService.TRADING_STATE_COMPLETED))
            {
                this.sendTradingCloseComposer();

                this.state = InventoryTradingService.TRADING_STATE_CANCELLED;
            }

            this._inventoryService.controller.furnitureService.unlockAllItems();

            this.state = InventoryTradingService.TRADING_STATE_READY;

            this._running = false;

            this._inventoryService.tradingVisible = false;
        }
    }

    public startTrade(userId: number, userName: string): void
    {
        if(!this.controller) return;

        if(!this.controller.furnitureService.isInitalized) this.controller.furnitureService.requestLoad();

        this.sendTradingOpenComposer(userId);
    }

    public _Str_23457(k: number, _arg_2: string, _arg_3: boolean, _arg_4: number, _arg_5: string, _arg_6: boolean): void
    {
        this._ownUserIndex      = k;
        this._ownUserName       = _arg_2;
        this._ownUserItems      = new AdvancedMap();
        this._ownUserAccepts    = false;
        this._ownUserCanTrade   = _arg_3;
        this._otherUserIndex    = _arg_4;
        this._otherUserName     = _arg_5;
        this._otherUserItems    = new AdvancedMap();
        this._otherUserAccepts  = false;
        this._otherUserCanTrade = _arg_6;
        this._running           = true;

        this.state = InventoryTradingService.TRADING_STATE_RUNNING;
    }

    private parseItems(k: TradingListItem[], _arg_2: AdvancedMap<string, GroupItem>): void
    {
        if(!this.controller) return;

        const totalItems = k.length;

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

                let groupItem = ((item.isGroupable && !this.isExternalImage(item.spriteId)) ? _arg_2.getValue(name) : null);

                if(!groupItem)
                {
                    groupItem = this.controller.furnitureService.createGroupItem(spriteId, category, item.stuffData);

                    _arg_2.add(name, groupItem);
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

    private updateTrade(parser: TradingListItemParser, firstUserItems: AdvancedMap<string, GroupItem>, secondUserItems: AdvancedMap<string, GroupItem>): void
    {
        if(this._ownUserItems) this._ownUserItems.reset();
        if(this._otherUserItems) this._otherUserItems.reset();

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

        this._inventoryService.updateItemLocking();
    }

    public offerItems(itemIds: number[], isWallItem: boolean, spriteId: number, category: number, groupable: boolean, stuffData: IObjectData): void
    {
        if(!groupable && (itemIds.length))
        {
            Nitro.instance.communication.connection.send(new TradingListAddItemComposer(itemIds.pop()));
        }
        else
        {
            const tradeIds: number[] = [];

            for(const itemId of itemIds)
            {
                if(this.canTradeItem(isWallItem, spriteId, category, groupable, stuffData))
                {
                    tradeIds.push(itemId);
                }
            }

            if(tradeIds.length)
            {
                if(tradeIds.length === 1)
                {
                    Nitro.instance.communication.connection.send(new TradingListAddItemComposer(tradeIds.pop()));
                }
                else
                {
                    Nitro.instance.communication.connection.send(new TradingListAddItemsComposer(...tradeIds));
                }
            }
        }
    }

    private canTradeItem(isWallItem: boolean, spriteId: number, category: number, groupable: boolean, stuffData: IObjectData): boolean
    {
        if(this._ownUserAccepts) return false;

        if(this._ownUserItems == null) return false;

        if(this._ownUserItems.length < InventoryTradingService.MAX_ITEMS_TO_TRADE) return true;

        if(!groupable) return false;

        let _local_6 = spriteId.toString();

        if(category === FurniCategory._Str_5186)
        {
            _local_6 = ((_local_6 + 'poster') + stuffData.getLegacyString());
        }
        else
        {
            if(category === FurniCategory._Str_12454)
            {
                _local_6 = InventoryTradingService._Str_16998(spriteId, stuffData);
            }
            else
            {
                _local_6 = (((isWallItem) ? 'I' : 'S') + _local_6);
            }
        }

        return !!this._ownUserItems.getValue(_local_6);
    }

    public removeItem(index: number): void
    {
        const groupItem = this._ownUserItems.getWithIndex(index);

        if(!groupItem) return;

        const item = groupItem.getLastItem();

        if(item) Nitro.instance.communication.connection.send(new TradingListItemRemoveComposer(item.id));
    }

    public getOwnTradingItemIds(): number[]
    {
        const itemIds: number[] = [];

        if(!this._ownUserItems || !this._ownUserItems.length) return itemIds;

        for(const groupItem of this._ownUserItems.getValues())
        {
            let i = 0;

            while(i < groupItem.getTotalCount())
            {
                const item = groupItem.getItemByIndex(i);

                if(item) itemIds.push(item.ref);

                i++;
            }
        }

        return itemIds;
    }

    public onTimerFinished(): void
    {
        if(this._state !== InventoryTradingService.TRADING_STATE_COUNTDOWN) return;

        this.state = InventoryTradingService.TRADING_STATE_CONFIRMING;
    }

    public sendTradingAcceptComposer(): void
    {
        Nitro.instance.communication.connection.send(new TradingAcceptComposer());
    }

    public sendTradingUnacceptComposer(): void
    {
        Nitro.instance.communication.connection.send(new TradingUnacceptComposer());
    }

    public sendTradingConfirmComposer(): void
    {
        this.state = InventoryTradingService.TRADING_STATE_CONFIRMED;

        Nitro.instance.communication.connection.send(new TradingConfirmationComposer());
    }

    public sendTradingCloseComposer(): void
    {
        Nitro.instance.communication.connection.send(new TradingCloseComposer());
    }

    public sendTradingCancelComposer(): void
    {
        Nitro.instance.communication.connection.send(new TradingCancelComposer());
    }

    private sendTradingOpenComposer(roomIndex: number): void
    {
        Nitro.instance.communication.connection.send(new TradingOpenComposer(roomIndex));
    }

    public get controller(): InventoryMainComponent
    {
        return this._inventoryService.controller;
    }

    public get state(): number
    {
        return this._state;
    }

    public set state(state: number)
    {
        if(this._state === state) return;

        const oldState = this._state;

        let didAssign = false;

        switch(this._state)
        {
            case InventoryTradingService.TRADING_STATE_READY:
                if((state === InventoryTradingService.TRADING_STATE_RUNNING) || (state === InventoryTradingService.TRADING_STATE_COMPLETED))
                {
                    this._state = state;

                    didAssign = true;
                }
                break;
            case InventoryTradingService.TRADING_STATE_RUNNING:
                if(state === InventoryTradingService.TRADING_STATE_COUNTDOWN)
                {
                    this._state = state;

                    didAssign = true;

                    this._inventoryService.tradeController.startTimer();
                }

                else if(state === InventoryTradingService.TRADING_STATE_CANCELLED)
                {
                    this._state = state;

                    didAssign = true;

                    // set minimized false
                }
                break;
            case InventoryTradingService.TRADING_STATE_COUNTDOWN:
                if(state === InventoryTradingService.TRADING_STATE_CONFIRMING)
                {
                    this._state = state;

                    didAssign = true;
                }

                else if(state === InventoryTradingService.TRADING_STATE_CANCELLED)
                {
                    this._state = state;

                    didAssign = true;

                    // set minimized false
                }

                else if(state === InventoryTradingService.TRADING_STATE_RUNNING)
                {
                    this._state = state;

                    didAssign = true;

                    // stop timer
                }
                break;
            case InventoryTradingService.TRADING_STATE_CONFIRMING:
                if(state === InventoryTradingService.TRADING_STATE_CONFIRMED)
                {
                    this._state = state;

                    didAssign = true;
                }

                else if(state === InventoryTradingService.TRADING_STATE_COMPLETED)
                {
                    this._state = state;

                    didAssign = true;

                    this.close();
                }

                else if(state === InventoryTradingService.TRADING_STATE_CANCELLED)
                {
                    this._state = state;

                    didAssign = true;

                    // set minimized false

                    this.close();
                }
                break;
            case InventoryTradingService.TRADING_STATE_CONFIRMED:
                if(state === InventoryTradingService.TRADING_STATE_COMPLETED)
                {
                    this._state = state;

                    didAssign = true;

                    // set minimized false

                    this.close();
                }

                else if(state === InventoryTradingService.TRADING_STATE_CANCELLED)
                {
                    this._state = state;

                    didAssign = true;

                    // set minimized false

                    this.close();
                }
                break;
            case InventoryTradingService.TRADING_STATE_COMPLETED:
                if(state === InventoryTradingService.TRADING_STATE_READY)
                {
                    this._state = state;

                    didAssign = true;
                }
                break;
            case InventoryTradingService.TRADING_STATE_CANCELLED:
                if(state === InventoryTradingService.TRADING_STATE_READY)
                {
                    this._state = state;

                    didAssign = true;
                }

                else if(state === InventoryTradingService.TRADING_STATE_RUNNING)
                {
                    this._state = state;

                    didAssign = true;
                }
                break;
        }

        console.log(oldState, this._state);

        if(didAssign)
        {
            // update locked images
        }
    }

    public get running(): boolean
    {
        return this._running;
    }

    public get ownUserName(): string
    {
        return this._ownUserName;
    }

    public get ownUserItems(): AdvancedMap<string, GroupItem>
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

    public get otherUserItems(): AdvancedMap<string, GroupItem>
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
