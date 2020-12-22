import { Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { RoomObjectVariable } from '../../../../../client/nitro/room/object/RoomObjectVariable';
import { RoomPreviewer } from '../../../../../client/nitro/room/preview/RoomPreviewer';
import { Vector3d } from '../../../../../client/room/utils/Vector3d';
import { AlertService } from '../../../alert/services/alert.service';
import { FurniCategory } from '../../items/FurniCategory';
import { GroupItem } from '../../items/GroupItem';
import { IFurnitureItem } from '../../items/IFurnitureItem';
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

    public paginateConfig: PaginationInstance = {
        id: 'custom',
        itemsPerPage: 250,
        currentPage: 1
    };

    constructor(
        private _alertService: AlertService,
        private _inventoryService: InventoryService,
        private _ngZone: NgZone) {}

    public ngOnInit(): void
    {
        if(this._inventoryService.controller.furnitureService.isInitalized) this.selectExistingGroupOrDefault();

        this._inventoryService.furniController = this;
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
        this._inventoryService.furniController = null;
    }

    private prepareInventory(): void
    {
        if(!this._inventoryService.controller.furnitureService.isInitalized || this._inventoryService.controller.furnitureService.needsUpdate)
        {
            this._inventoryService.controller.furnitureService.requestLoad();
        }
        else
        {
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

        for(let groupItem of this.groupItems)
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

            let furnitureItem = this.selectedGroup.getItemByIndex(0);

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
                            this.roomPreviewer.addFurnitureIntoRoom(this.selectedGroup.type, new Vector3d(90), this.selectedGroup.stuffData, (this.selectedGroup.extra.toString()))
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
        let itemIds: number[]           = [];

        for(let item of itemsInTrade)
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
                this._alertService.alert('${trading.items.too_many_items.desc}', '${trading.items.too_many_items.title}');
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

    public get groupItems(): GroupItem[]
    {
        return this._inventoryService.controller.furnitureService.groupItems;
    }

    public get tradeRunning(): boolean
    {
        return this._inventoryService.controller.tradeService.running;
    }

    public get canPlace(): boolean
    {
        return !!this._inventoryService.roomSession;
    }
}