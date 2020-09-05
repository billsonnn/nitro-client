import { EventEmitter, Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { FurnitureListAddOrUpdateEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurnitureListAddOrUpdateEvent';
import { FurnitureListEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurnitureListEvent';
import { FurnitureListInvalidateEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurnitureListInvalidateEvent';
import { FurnitureListRemovedEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurnitureListRemovedEvent';
import { FurniturePostItPlacedEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurniturePostItPlacedEvent';
import { FurnitureList2Composer } from '../../../../client/nitro/communication/messages/outgoing/inventory/furni/FurnitureList2Composer';
import { FurnitureListComposer } from '../../../../client/nitro/communication/messages/outgoing/inventory/furni/FurnitureListComposer';
import { FurnitureListItemParser } from '../../../../client/nitro/communication/messages/parser/inventory/furniture/utils/FurnitureListItemParser';
import { Nitro } from '../../../../client/nitro/Nitro';
import { IObjectData } from '../../../../client/nitro/room/object/data/IObjectData';
import { FurniCategory } from '../enum/FurniCategory';
import { UnseenItemCategoryEnum } from '../enum/UnseenItemCategoryEnum';
import { FurnitureItem } from '../items/FurnitureItem';
import { GroupItem } from '../items/GroupItem';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryFurniService implements OnDestroy
{
    private _messages: IMessageEvent[];
    private _furniMsgFragments: Map<number, FurnitureListItemParser>[];
    private _furniData: GroupItem[];
    private _furniLoaded: boolean;

    private _itemIdInFurniPlacing: number;
    private _isObjectMoverRequested: boolean;
    private _isListInitialized: boolean;

    private _groupItemEmitter: EventEmitter<GroupItem>;

    constructor(
        private inventoryService: InventoryService,
        private ngZone: NgZone)
    {
        this._messages                  = [];
        this._furniMsgFragments         = null;
        this._furniData                 = [];
        this._furniLoaded               = false;

        this._itemIdInFurniPlacing      = -1;
        this._isObjectMoverRequested    = false;
        this._isListInitialized         = false;

        this._groupItemEmitter          = new EventEmitter();
        
        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        if(this._messages) this.unregisterMessages();

        this.ngZone.runOutsideAngular(() =>
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

    private unregisterMessages(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            if(this._messages && this._messages.length)
            {
                for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

                this._messages = [];
            }
        });
    }

    public selectGroupItem(groupItem: GroupItem): void
    {
        if(!groupItem) return;

        this._groupItemEmitter.emit(groupItem);
    }

    public requestLoad(): void
    {
        this._furniLoaded = true;
        
        this.ngZone.runOutsideAngular(() =>
        {
            if(this.inventoryService.isInRoom)
            {
                Nitro.instance.communication.connection.send(new FurnitureListComposer());
            }
            else
            {
                Nitro.instance.communication.connection.send(new FurnitureList2Composer());
            }
        });
    }

    private onFurnitureListAddOrUpdateEvent(event: FurnitureListAddOrUpdateEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
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

        this.ngZone.run(() => this._Str_24428(merged));

        this._furniMsgFragments = null;
    }

    private onFurnitureListInvalidateEvent(event: FurnitureListInvalidateEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(this._furniLoaded) this.requestLoad();
    }

    private onFurnitureListRemovedEvent(event: FurnitureListRemovedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const itemId = parser.itemId;

        this.ngZone.run(() => this.removeItemById(itemId));

        //if(groupItem) this._Str_4409();
    }

    private onFurniturePostItPlacedEvent(event: FurnitureListAddOrUpdateEvent): void
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

    private getAllItemIds(): number[]
    {
        const itemIds: number[] = [];

        for(let groupItem of this._furniData)
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

    public _Str_24428(fragment: Map<number, FurnitureListItemParser>):void
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

        if(!emptyExistingSet)
        {
            if(addedSet.length)
            {
                // run lock checking in sub sets, trading, marketplace etc
            }
        }

        this.setListInitialized();
    }

    private addFurnitureItem(k: FurnitureItem, _arg_2: boolean): void
    {
        let groupItem: GroupItem = null;

        if(!k.isGroupable)
        {
            groupItem = this._Str_22387(k, _arg_2);
        }
        else
        {
            groupItem = this._Str_23860(k, _arg_2);
        }

        if(!_arg_2) groupItem.unseen = true;
    }

    private _Str_22387(k: FurnitureItem, _arg_2: boolean): GroupItem
    {
        const groupItems: GroupItem[] = [];

        for(let groupItem of this._furniData)
        {
            if(groupItem.type === k.type) groupItems.push(groupItem);
        }

        for(let groupItem of groupItems)
        {
            if(groupItem.getItemById(k.id)) return groupItem;
        }

        const unseen    = this._Str_3613(k);
        const groupItem = this.createGroupItem(k.type, k.category, k.stuffData, k._Str_2794, _arg_2);

        groupItem.push(k, unseen);

        if(unseen)
        {
            groupItem.unseen = true;

            this.unshift(groupItem);
        }
        else
        {
            this.push(groupItem);
        }

        return groupItem;
    }

    private _Str_23860(item: FurnitureItem, _arg_2: boolean): GroupItem
    {
        let existingGroup: GroupItem = null;

        for(let groupItem of this._furniData)
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

        const unseen = this._Str_3613(item);

        if(existingGroup)
        {
            existingGroup.push(item, unseen);

            if(unseen)
            {
                existingGroup.unseen = true;

                this.moveToFront(existingGroup);
            }

            return existingGroup;
        }

        existingGroup = this.createGroupItem(item.type, item.category, item.stuffData, item._Str_2794, _arg_2);
        
        existingGroup.push(item, unseen);

        if(unseen)
        {
            existingGroup.unseen = true;

            this.unshift(existingGroup);
        }
        else
        {
            this.push(existingGroup);
        }

        return existingGroup;
    }

    public removeItemById(k: number): GroupItem
    {
        let i = 0;

        while(i < this._furniData.length)
        {
            const groupItem = this._furniData[i];
            const item      = groupItem.remove(k);

            if(item)
            {
                if(this._itemIdInFurniPlacing === item.ref)
                {
                    //this._Str_5298();

                    // if(!this._Str_5337())
                    // {
                    //     //this._controller._Str_4731();
                    // }
                }

                if(groupItem.getTotalCount() <= 0)
                {
                    this._furniData.splice(i, 1);

                    // if(((this._view) && (this._view.grid)))
                    // {
                    //     this._view.grid._Str_9854(groupItem);
                    // }

                    //if(groupItem._Str_2365) this._Str_14744();

                    groupItem.dispose();
                }
                else
                {
                    //this._view._Str_2944();
                }

                //this._view._Str_7636();

                return groupItem;
            }

            i++;
        }

        return null;
    }

    private _Str_3613(item: FurnitureItem): boolean
    {
        let category = 0;

        if(item.rentable) category = UnseenItemCategoryEnum.RENTABLE;
        else category = UnseenItemCategoryEnum.FURNI;

        return this.inventoryService.unseenTracker._Str_3613(category, item.id);
    }

    private createGroupItem(k: number, category: number, stuffData: IObjectData, extra: number = NaN, flag: boolean = false): GroupItem
    {
        let iconImage: HTMLImageElement = null;

        if(category == FurniCategory._Str_3639)
        {
            // const icon = this._windowManager.assets.getAssetByName("inventory_furni_icon_wallpaper");
            // if (icon != null)
            // {
            //     iconImage = (icon.content as BitmapData).clone();
            // }
        }

        else if(category == FurniCategory._Str_3683)
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

        return new GroupItem(this, k, category, Nitro.instance.roomEngine, stuffData, extra);
    }

    private unshift(k: GroupItem):void
    {
        this._furniData.unshift(k);
    }

    private push(k: GroupItem):void
    {
        this._furniData.push(k);
    }

    private remove(k: GroupItem): void
    {
        const index = this._furniData.indexOf(k);

        if(index > -1) this._furniData.splice(index, 1);
    }

    private moveToFront(k: GroupItem): void
    {
        this.remove(k);
        this.unshift(k);
    }

    private setListInitialized():void
    {
        if(this._isListInitialized) return;

        this._isListInitialized = true;
    }

    public get furniLoaded(): boolean
    {
        return this._furniLoaded;
    }

    public get furniList(): GroupItem[]
    {
        return this._furniData;
    }
    
    public get groupItemEmitter(): EventEmitter<GroupItem>
    {
        return this._groupItemEmitter;
    }
}