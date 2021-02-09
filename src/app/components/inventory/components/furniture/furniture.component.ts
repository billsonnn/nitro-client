import { Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { RoomObjectVariable } from '../../../../../client/nitro/room/object/RoomObjectVariable';
import { RoomPreviewer } from '../../../../../client/nitro/room/preview/RoomPreviewer';
import { Vector3d } from '../../../../../client/room/utils/Vector3d';
import { NotificationService } from '../../../notification/services/notification.service';
import { FurniCategory } from '../../items/FurniCategory';
import { GroupItem } from '../../items/GroupItem';
import { IFurnitureItem } from '../../items/IFurnitureItem';
import { InventoryFurnitureService } from '../../services/furniture.service';
import { InventoryService } from '../../services/inventory.service';

@Component({
    selector: '[nitro-inventory-furniture-component]',
    templateUrl: './furniture.template.html'
})
export class InventoryFurnitureComponent implements OnInit, OnChanges, OnDestroy
{
    @Input()
    public visible: boolean = false;

    @Input()
    public roomPreviewer: RoomPreviewer = null;

    public selectedGroup: GroupItem = null;
    public mouseDown: boolean = false;

    private _filteredItems: GroupItem[] = [];
    private _search: string = '';
    private _searchType: string = '';
    private _subscription: Subscription = null;
    private _hasGroupItems: boolean = false;

    constructor(
        private _notificationService: NotificationService,
        private _inventoryService: InventoryService,
        private _ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        if(this._inventoryService.controller.furnitureService.isInitalized) this.selectExistingGroupOrDefault();

        this._inventoryService.furniController = this;

        this._subscription = this._inventoryService.events.subscribe(event =>
        {
            switch(event)
            {
                case InventoryFurnitureService.INVENTORY_UPDATED:
                    this.refreshInventory();
                    return;
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = (changes.visible.previousValue || false);
        const next = changes.visible.currentValue;

        if(next !== prev)
        {
            if(next)
            {
                this.prepareInventory();
            }
            else
            {
                this._inventoryService.controller.setAllFurnitureSeen();
            }
        }
    }

    public ngOnDestroy(): void
    {
        if(this._subscription)
        {
            this._subscription.unsubscribe();

            this._subscription = null;
        }

        this._inventoryService.furniController = null;
    }

    private refreshInventory(): void
    {
        let groupItems = this._inventoryService.controller.furnitureService.groupItems;

        if(groupItems.length) this._hasGroupItems = true;

        if((this._search && this._search.length) || (this._searchType && this._searchType.length))
        {
            const comparison = this._search.toLocaleLowerCase();

            groupItems = groupItems.filter(item =>
            {
                let found = true;

                if(this._searchType && this._searchType.length === 1)
                {
                    if(this._searchType === 's') found = !item.isWallItem;
                    else if(this._searchType === 'i') found = item.isWallItem;
                }

                if(comparison && comparison.length)
                {
                    found = (item.name.toLocaleLowerCase().includes(comparison));
                }

                return found;
            });
        }

        this._filteredItems = groupItems;
    }

    private prepareInventory(): void
    {
        if(!this._inventoryService.controller.furnitureService.isInitalized || this._inventoryService.controller.furnitureService.needsUpdate)
        {
            this._inventoryService.controller.furnitureService.requestLoad();
        }
        else
        {
            this.refreshInventory();

            this.selectExistingGroupOrDefault();
        }
    }

    public selectExistingGroupOrDefault(): void
    {
        if(this.selectedGroup)
        {
            const index = this.groupItems.indexOf(this.selectedGroup);

            if(index > -1)
            {
                this.selectGroup(this.selectedGroup);

                return;
            }
        }

        this.selectFirstGroup();
    }

    public selectFirstGroup(): void
    {
        let group: GroupItem = null;

        for(const groupItem of this.groupItems)
        {
            if(!groupItem || groupItem.locked) continue;

            group = groupItem;

            break;
        }

        this.selectGroup(group);
    }

    private selectGroup(groupItem: GroupItem): void
    {
        this._inventoryService.controller.furnitureService.unselectAllGroupItems();

        this.selectedGroup = groupItem;

        if(this.selectedGroup)
        {
            this.selectedGroup.selected = true;

            if(this.selectedGroup.hasUnseenItems) this.selectedGroup.hasUnseenItems = false;

            const furnitureItem = this.selectedGroup.getItemByIndex(0);

            if(!furnitureItem) return;

            this._ngZone.runOutsideAngular(() =>
            {
                if(this.roomPreviewer)
                {
                    let wallType        = Nitro.instance.roomEngine.getRoomInstanceVariable<string>(Nitro.instance.roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE);
                    let floorType       = Nitro.instance.roomEngine.getRoomInstanceVariable<string>(Nitro.instance.roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE);
                    let landscapeType   = Nitro.instance.roomEngine.getRoomInstanceVariable<string>(Nitro.instance.roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE);

                    wallType        = (wallType && wallType.length) ? wallType : '101';
                    floorType       = (floorType && floorType.length) ? floorType : '101';
                    landscapeType   = (landscapeType && landscapeType.length) ? landscapeType : '1.1';

                    this.roomPreviewer.reset(false);
                    this.roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);

                    if((furnitureItem.category === FurniCategory._Str_3639) || (furnitureItem.category === FurniCategory._Str_3683) || (furnitureItem.category === FurniCategory._Str_3432))
                    {
                        this.roomPreviewer.updateRoomWallsAndFloorVisibility(true, true);

                        floorType       = ((furnitureItem.category === FurniCategory._Str_3683) ? this.selectedGroup.stuffData.getLegacyString() : floorType);
                        wallType        = ((furnitureItem.category === FurniCategory._Str_3639) ? this.selectedGroup.stuffData.getLegacyString() : wallType);
                        landscapeType   = ((furnitureItem.category === FurniCategory._Str_3432) ? this.selectedGroup.stuffData.getLegacyString() : landscapeType);

                        this.roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);

                        if(furnitureItem.category === FurniCategory._Str_3432)
                        {
                            // insert a window if the type is landscape
                            //_local_19 = this._model.controller._Str_18225("ads_twi_windw", ProductTypeEnum.WALL);
                            //this._roomPreviewer._Str_12087(_local_19.id, new Vector3d(90, 0, 0), _local_19._Str_4558);
                        }
                    }
                    else
                    {
                        if(groupItem.isWallItem)
                        {
                            this.roomPreviewer.updateRoomWallsAndFloorVisibility(true, true);
                            this.roomPreviewer.addWallItemIntoRoom(this.selectedGroup.type, new Vector3d(90), furnitureItem.stuffData.getLegacyString());
                        }
                        else
                        {
                            this.roomPreviewer.updateRoomWallsAndFloorVisibility(false, true);
                            this.roomPreviewer.addFurnitureIntoRoom(this.selectedGroup.type, new Vector3d(90), this.selectedGroup.stuffData, (this.selectedGroup.extra.toString()));
                        }
                    }
                }
            });
        }
        else
        {
            this._ngZone.runOutsideAngular(() => this.roomPreviewer && this.roomPreviewer.reset(false));
        }
    }

    public onMouseDown(groupItem: GroupItem): void
    {
        if(!groupItem) return;

        this.selectGroup(groupItem);

        this.mouseDown = true;
    }

    public onMouseUp(groupItem: GroupItem): void
    {
        this.mouseDown = false;
    }

    public onMouseOut(groupItem: GroupItem): void
    {
        if(!this.mouseDown) return;

        if(this.selectedGroup !== groupItem) return;

        this.attemptItemPlacement();
    }

    public attemptItemPlacement(): void
    {
        if(!this.canPlace || this.tradeRunning) return;

        this._ngZone.runOutsideAngular(() => this._inventoryService.controller.furnitureService.attemptItemPlacement());

        this._inventoryService.hideWindow();
    }

    public attemptItemOffer(count: number = 1): void
    {
        if(!this.selectedGroup || !this.tradeRunning) return;

        const groupItem = this.selectedGroup;

        if(!groupItem) return;

        const itemsInTrade = groupItem.getTradeItems(count);

        if(!itemsInTrade || !itemsInTrade.length) return;

        let coreItem: IFurnitureItem    = null;
        const itemIds: number[]           = [];

        for(const item of itemsInTrade)
        {
            itemIds.push(item.id);

            if(!coreItem) coreItem = item;
        }

        if(!coreItem) return;

        if(this.tradeRunning)
        {
            const ownItemCount = this._inventoryService.controller.tradeService.getOwnTradingItemIds().length;

            if((ownItemCount + itemIds.length) <= 1500)
            {
                this._inventoryService.controller.tradeService.offerItems(itemIds, coreItem.isWallItem, coreItem.type, coreItem.category, coreItem.isGroupable, coreItem.stuffData);
            }
            else
            {
                this._notificationService.alert('${trading.items.too_many_items.desc}', '${trading.items.too_many_items.title}');
            }
        }
    }

    public getIconUrl(groupItem: GroupItem): string
    {
        const imageUrl = ((groupItem && groupItem.iconUrl) || null);

        return imageUrl;

        // if(imageUrl && (imageUrl !== '')) return `url('${ imageUrl }')`;

        // return null;
    }

    public trackByType(index: number, item: GroupItem): number
    {
        return item.type;
    }

    public get groupItems(): GroupItem[]
    {
        return this._filteredItems;
    }

    public get tradeRunning(): boolean
    {
        return this._inventoryService.controller.tradeService.running;
    }

    public get canPlace(): boolean
    {
        return !!this._inventoryService.roomSession;
    }

    public get paginateConfig(): PaginationInstance
    {
        return {
            id: 'custom',
            itemsPerPage: 5,
            currentPage: 1
        };
    }

    public get search(): string
    {
        return this._search;
    }

    public set search(search: string)
    {
        this._search = search;

        this.refreshInventory();
    }

    public get searchType(): string
    {
        return this._searchType;
    }

    public set searchType(type: string)
    {
        this._searchType = type;

        this.refreshInventory();
    }

    public get hasGroupItems(): boolean
    {
        return this._hasGroupItems;
    }
}
