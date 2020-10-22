import { EventEmitter, Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { FurnitureListAddOrUpdateEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurnitureListAddOrUpdateEvent';
import { FurnitureListEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurnitureListEvent';
import { FurnitureListInvalidateEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurnitureListInvalidateEvent';
import { FurnitureListRemovedEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurnitureListRemovedEvent';
import { FurniturePostItPlacedEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurniturePostItPlacedEvent';
import { FurnitureListComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/furni/FurnitureListComposer';
import { FurnitureListItemParser } from '../../../../client/nitro/communication/messages/parser/inventory/furniture/utils/FurnitureListItemParser';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomObjectPlacementSource } from '../../../../client/nitro/room/enums/RoomObjectPlacementSource';
import { IObjectData } from '../../../../client/nitro/room/object/data/IObjectData';
import { RoomObjectCategory } from '../../../../client/nitro/room/object/RoomObjectCategory';
import { SettingsService } from '../../../core/settings/service';
import { FurniCategory } from '../items/FurniCategory';
import { FurnitureItem } from '../items/FurnitureItem';
import { GroupItem } from '../items/GroupItem';
import { InventoryService } from '../service';
import { UnseenItemCategory } from '../unseen/UnseenItemCategory';

@Injectable()
export class InventoryFurnitureService implements OnDestroy
{
    public static SELECT_FIRST_GROUP: string            = 'IFS_SELECT_FIRST_GROUP';
    public static SELECT_EXISTING_GROUP_DEFAULT: string = 'IFS_SELECT_EXISTING_GROUP_DEFAULT';

    private _events: Subject<string>;
    private _messages: IMessageEvent[] = [];
    private _furniMsgFragments: Map<number, FurnitureListItemParser>[] = [];
    private _groupItems: GroupItem[] = [];
    private _itemIdInFurniPlacing: number = -1;
    private _isObjectMoverRequested: boolean = false;

    private _isInitialized: boolean = false;

    constructor(
        private _settingsService: SettingsService,
        private _inventoryService: InventoryService,
        private _ngZone: NgZone)
    {
        this._events = new EventEmitter();
        
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
                new FurnitureListAddOrUpdateEvent(this.onFurnitureListAddOrUpdateEvent.bind(this)),
                new FurnitureListEvent(this.onFurnitureListEvent.bind(this)),
                new FurnitureListInvalidateEvent(this.onFurnitureListInvalidateEvent.bind(this)),
                new FurnitureListRemovedEvent(this.onFurnitureListRemovedEvent.bind(this)),
                new FurniturePostItPlacedEvent(this.onFurniturePostItPlacedEvent.bind(this))
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

    private onFurnitureListAddOrUpdateEvent(event: FurnitureListAddOrUpdateEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const items = parser.items;

        this._ngZone.run(() =>
        {
            for(let item of items)
            {
                const groupItem = this.getGroupItemForFurnitureId(item.itemId);

                if(groupItem)
                {
                    const furnitureItem = groupItem.getItemById(item.itemId);

                    if(furnitureItem)
                    {
                        furnitureItem.update(item);
                        
                        groupItem.hasUnseenItems = true;
                    }
                }
                else
                {
                    const furnitureItem = new FurnitureItem(item);

                    this.addFurnitureItem(furnitureItem, false);
                }
            }
        });
    }

    private onFurnitureListEvent(event: FurnitureListEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!this._furniMsgFragments) this._furniMsgFragments = new Array(parser.totalFragments);

        const map       = new Map([ ...parser.fragment ]);
        const merged    = this.mergeFragments(map, parser.totalFragments, parser.fragmentNumber, this._furniMsgFragments);

        if(!merged) return;

        this._ngZone.run(() => this.processFragment(merged));

        this._furniMsgFragments = null;
    }

    private onFurnitureListInvalidateEvent(event: FurnitureListInvalidateEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(this._settingsService.inventoryVisible && this._inventoryService.furnitureVisible) this.requestLoad();
    }

    private onFurnitureListRemovedEvent(event: FurnitureListRemovedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            const groupItem = this.removeItemById(parser.itemId);
        
            if(groupItem) this.setAllFurnitureSeen();
        });
    }

    private onFurniturePostItPlacedEvent(event: FurniturePostItPlacedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private mergeFragments(fragment: Map<number, FurnitureListItemParser>, totalFragments: number, fragmentNumber: number, fragments: Map<number, FurnitureListItemParser>[]): Map<number, FurnitureListItemParser>
    {
        if(totalFragments === 1) return fragment;

        fragments[fragmentNumber] = fragment;

        for(let frag of fragments)
        {
            if(!frag) return null;
        }

        const mergedFragment: Map<number, FurnitureListItemParser> = new Map();

        for(let frag of fragments)
        {
            for(let [ key, value ] of frag) mergedFragment.set(key, value);

            frag.clear();
        }

        fragments = null;

        return mergedFragment;
    }

    private processFragment(fragment: Map<number, FurnitureListItemParser>): void
    {
        const existingSet           = this.getAllItemIds();
        const addedSet: number[]    = [];
        const removedSet: number[]  = [];

        for(let key of fragment.keys())
        {
            if(existingSet.indexOf(key) === -1) addedSet.push(key);
        }

        for(let itemId of existingSet)
        {
            if(!fragment.get(itemId)) removedSet.push(itemId);
        }

        const emptyExistingSet = (existingSet.length === 0);

        for(let itemId of removedSet)
        {
            this.removeItemById(itemId);
        }

        for(let itemId of addedSet)
        {
            const parser = fragment.get(itemId);

            if(!parser) continue;

            const item = new FurnitureItem(parser);

            this.addFurnitureItem(item, true);
        }

        this._isInitialized = true;

        this._events.next(InventoryFurnitureService.SELECT_EXISTING_GROUP_DEFAULT);
    }

    private getAllItemIds(): number[]
    {
        const itemIds: number[] = [];

        for(let groupItem of this._groupItems)
        {
            let totalCount = groupItem.getTotalCount();

            if(groupItem.category === FurniCategory._Str_12351) totalCount = 1;

            let i = 0;

            while(i < totalCount)
            {
                itemIds.push(groupItem.getItemByIndex(i).id);

                i++;
            }
        }

        return itemIds;
    }

    private addFurnitureItem(item: FurnitureItem, flag: boolean): void
    {
        let groupItem: GroupItem = null;

        if(!item.isGroupable)
        {
            groupItem = this.addSingleFurnitureItem(item, flag);
        }
        else
        {
            groupItem = this.addGroupableFurnitureItem(item, flag);
        }

        if(!flag) groupItem.hasUnseenItems = true;
    }

    private addSingleFurnitureItem(item: FurnitureItem, flag: boolean): GroupItem
    {
        const groupItems: GroupItem[] = [];

        for(let groupItem of this._groupItems)
        {
            if(groupItem.type === item.type) groupItems.push(groupItem);
        }

        for(let groupItem of groupItems)
        {
            if(groupItem.getItemById(item.id)) return groupItem;
        }

        const unseen    = this.isFurnitureUnseen(item);
        const groupItem = this.createGroupItem(item.type, item.category, item.stuffData, item._Str_2794, flag);

        groupItem.push(item, unseen);

        if(unseen)
        {
            groupItem.hasUnseenItems = true;

            this.unshiftGroupitem(groupItem);
        }
        else
        {
            this.pushGroupItem(groupItem);
        }

        return groupItem;
    }

    private addGroupableFurnitureItem(item: FurnitureItem, flag: boolean): GroupItem
    {
        let existingGroup: GroupItem = null;

        for(let groupItem of this._groupItems)
        {
            if((groupItem.type === item.type) && (groupItem.isWallItem == item.isWallItem) && groupItem.isGroupable)
            {
                if(item.category === FurniCategory._Str_5186)
                {
                    if(groupItem.stuffData.getLegacyString() === item.stuffData.getLegacyString())
                    {
                        existingGroup = groupItem;

                        break;
                    }
                }

                else if(item.category === FurniCategory._Str_12454)
                {
                    if(item.stuffData.compare(groupItem.stuffData))
                    {
                        existingGroup = groupItem;

                        break;
                    }
                }

                else
                {
                    existingGroup = groupItem;

                    break;
                }
            }
        }

        const unseen = this.isFurnitureUnseen(item);

        if(existingGroup)
        {
            existingGroup.push(item, unseen);

            if(unseen)
            {
                existingGroup.hasUnseenItems = true;

                this.removeAndUnshiftGroupitem(existingGroup);
            }

            return existingGroup;
        }

        existingGroup = this.createGroupItem(item.type, item.category, item.stuffData, item._Str_2794, flag);
        
        existingGroup.push(item, unseen);

        if(unseen)
        {
            existingGroup.hasUnseenItems = true;

            this.unshiftGroupitem(existingGroup);
        }
        else
        {
            this.pushGroupItem(existingGroup);
        }

        return existingGroup;
    }

    public createGroupItem(type: number, category: number, stuffData: IObjectData, extra: number = NaN, flag: boolean = false): GroupItem
    {
        let iconImage: HTMLImageElement = null;

        if(category === FurniCategory._Str_3639)
        {
            // const icon = this._windowManager.assets.getAssetByName("inventory_furni_icon_wallpaper");
            // if (icon != null)
            // {
            //     iconImage = (icon.content as BitmapData).clone();
            // }
        }

        else if(category === FurniCategory._Str_3683)
        {
            // const icon = this._windowManager.assets.getAssetByName("inventory_furni_icon_floor");
            // if (icon != null)
            // {
            //     iconImage = (icon.content as BitmapData).clone();
            // }
        }

        else if(category === FurniCategory._Str_3432)
        {
            // const icon = this._windowManager.assets.getAssetByName("inventory_furni_icon_landscape");
            // if (icon != null)
            // {
            //     iconImage = (icon.content as BitmapData).clone();
            // }
        }

        const groupItem = new GroupItem(type, category, Nitro.instance.roomEngine, stuffData, extra);

        return groupItem;
    }

    public removeItemById(id: number): GroupItem
    {
        let i = 0;

        while(i < this._groupItems.length)
        {
            const groupItem = this._groupItems[i];
            const item      = groupItem.remove(id);

            if(item)
            {
                if(this._itemIdInFurniPlacing === item.ref)
                {
                    this.cancelRoomObjectPlacement();

                    if(!this.attemptItemPlacement())
                    {
                        this._events.next(InventoryFurnitureService.SELECT_EXISTING_GROUP_DEFAULT);
                    }
                }

                if(groupItem.getTotalCount() <= 0)
                {
                    this._groupItems.splice(i, 1);

                    if(groupItem.selected)
                    {
                        this._events.next(InventoryFurnitureService.SELECT_FIRST_GROUP);
                    }

                    groupItem.dispose();
                }

                return groupItem;
            }

            i++;
        }

        return null;
    }

    private isFurnitureUnseen(item: FurnitureItem): boolean
    {
        let category = 0;

        if(item.rentable) category = UnseenItemCategory.RENTABLE;
        else category = UnseenItemCategory.FURNI;

        return this._inventoryService.unseenTracker._Str_3613(category, item.id);
    }

    public setAllFurnitureSeen(): void
    {
        this._inventoryService.unseenTracker._Str_8813(UnseenItemCategory.FURNI);
        
        for(let groupItem of this._groupItems)
        {
            if(groupItem.hasUnseenItems)
            {
                groupItem.hasUnseenItems = false;
            }
        }

        this._inventoryService.updateUnseenCount();
    }

    public attemptItemPlacement(flag: boolean = false): boolean
    {
        const groupItem = this.getSelectedGroup();

        if(!groupItem) return false;

        if(!groupItem.getUnlockedCount()) return false;

        const item = groupItem.getLastItem();

        if(!item) return false;

        if((item.category === FurniCategory._Str_3683) || (item.category === FurniCategory._Str_3639) || (item.category === FurniCategory._Str_3432))
        {
            if(flag) return false;

            //this._communication.connection.send(new _Str_5270(_local_3.id));
        }
        else
        {
            this.startRoomObjectPlacement(item);
        }

        return true;
    }

    private startRoomObjectPlacement(item: FurnitureItem): void
    {
        let category    = 0;
        let isMoving    = false;

        if(item.isWallItem) category = RoomObjectCategory.WALL;
        else category = RoomObjectCategory.FLOOR;

        if((item.category === FurniCategory._Str_5186)) // or external image from furnidata
        {
            isMoving = Nitro.instance.roomEngine.processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, item.id, category, item.type, item.stuffData.getLegacyString());
        }
        else
        {
            isMoving = Nitro.instance.roomEngine.processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, item.id, category, item.type, item.stuffData.getLegacyString(), item.stuffData);
        }

        if(isMoving)
        {
            this._itemIdInFurniPlacing = item.ref;

            this.setObjectMoverRequested(true);
        }
    }

    private cancelRoomObjectPlacement(): void
    {
        if(this._itemIdInFurniPlacing > -1)
        {
            Nitro.instance.roomEngine.cancelRoomObjectPlacement();

            this.setObjectMoverRequested(false);

            this._itemIdInFurniPlacing = -1;
        }
    }

    public getGroupItemForFurnitureId(id: number): GroupItem
    {
        for(let groupItem of this._groupItems)
        {
            const item = groupItem.getItemById(id);

            if(item) return groupItem;
        }

        return null;
    }

    public getSelectedGroup(): GroupItem
    {
        for(let groupItem of this._groupItems)
        {
            if(groupItem && groupItem.selected) return groupItem;
        }

        return null;
    }

    private unshiftGroupitem(groupItem: GroupItem): void
    {
        this._groupItems.unshift(groupItem);
    }

    private pushGroupItem(groupItem: GroupItem): void
    {
        this._groupItems.push(groupItem);
    }

    private removeGroupItem(k: GroupItem): void
    {
        const index = this._groupItems.indexOf(k);

        if(index > -1) this._groupItems.splice(index, 1);
    }

    private removeAndUnshiftGroupitem(k: GroupItem): void
    {
        this.removeGroupItem(k);
        this.unshiftGroupitem(k);
    }

    public unselectAllGroupItems(): void
    {
        for(let groupItem of this._groupItems) groupItem.selected = false;
    }

    public requestLoad(): void
    {
        Nitro.instance.communication.connection.send(new FurnitureListComposer());
    }

    private setObjectMoverRequested(flag: boolean)
    {
        if(this._isObjectMoverRequested === flag) return;

        this._ngZone.run(() => (this._isObjectMoverRequested = flag));
    }

    public get events(): Subject<string>
    {
        return this._events;
    }

    public get isInitalized(): boolean
    {
        return this._isInitialized;
    }

    public get groupItems(): GroupItem[]
    {
        return this._groupItems;
    }

    public get isObjectMoverRequested(): boolean
    {
        return this._isObjectMoverRequested;
    }
}