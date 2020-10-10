import { Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomObjectVariable } from '../../../../client/nitro/room/object/RoomObjectVariable';
import { RoomPreviewer } from '../../../../client/nitro/room/preview/RoomPreviewer';
import { Vector3d } from '../../../../client/room/utils/Vector3d';
import { FurniCategory } from '../items/FurniCategory';
import { GroupItem } from '../items/GroupItem';
import { InventoryTradingService } from '../trading/service';
import { InventoryFurnitureService } from './service';

@Component({
	selector: '[nitro-inventory-furniture-component]',
    template: `
    <div *ngIf="visible" class="nitro-inventory-furni-component">
        <div class="container">
            <div class="row" *ngIf="!groupItems.length">
                {{ ('inventory.empty.title') | translate }}
                {{ ('inventory.empty.desc') | translate }}
            </div>
            <div class="row" *ngIf="groupItems.length">
                <div class="col-7">
                    <div class="grid-container">
                        <div class="grid-items">
                            <div class="item-detail" *ngFor="let groupItem of groupItems" [ngClass]="{ 'unseen': groupItem.hasUnseenItems, 'active': (selectedGroup === groupItem) }" [ngStyle]="{ 'opacity': (!groupItem.getUnlockedCount() ? '0.5' : '1') }" (click)="selectGroup(groupItem)">
                                <div class="detail-image" [ngStyle]="{ 'background-image': getIconUrl(groupItem) }"></div>
                                <div class="badge badge-secondary" *ngIf="!groupItem.stuffData.uniqueNumber">x{{ groupItem.getUnlockedCount() }}</div>
                                <div class="badge badge-secondary" *ngIf="groupItem.stuffData.uniqueNumber">{{ groupItem.stuffData.uniqueNumber }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-5">
                    <div class="room-previewer" nitro-room-preview-component [roomPreviewer]="roomPreviewer" [height]="140"></div>
                    <div class="furni-container" *ngIf="selectedGroup">
                        <div class="furni-name">{{ selectedGroup.name }}</div>
                        <div class="furni-buttons w-100">
                            <ng-container *ngIf="!tradeRunning">
                                <button type="button" class="btn btn-light w-100" (click)="attemptItemPlacement()">{{ ('inventory.furni.placetoroom') | translate }}</button>
                            </ng-container>
                            <ng-container *ngIf="tradeRunning">
                                <button type="button" class="btn btn-light w-100" (click)="attemptItemOffer()" [ngClass]="{ 'disabled': !selectedGroup.getUnlockedCount()} ">{{ ('inventory.trading.offer') | translate }}</button>
                            </ng-container>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class InventoryFurnitureComponent implements OnInit, OnChanges, OnDestroy
{
    private static RESULTS_PER_PAGE = 5;

    @Input()
    public visible: boolean = false;

    public roomPreviewer: RoomPreviewer = null;
    public selectedGroup: GroupItem = null;

    constructor(
        private _inventoryFurnitureService: InventoryFurnitureService,
        private _inventoryTradingService: InventoryTradingService,
        private _ngZone: NgZone) {}

    public ngOnInit(): void
    {
        this._inventoryFurnitureService.controller = this;

        if(!this.roomPreviewer)
        {
            this.roomPreviewer = new RoomPreviewer(Nitro.instance.roomEngine, ++RoomPreviewer.PREVIEW_COUNTER);
        }

        if(this._inventoryFurnitureService.isInitalized) this.selectExistingGroupOrDefault();
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.visible.previousValue;
        const next = changes.visible.currentValue;

        if(next && (next !== prev)) this.prepareInventory();
    }

    public ngOnDestroy(): void
    {
        if(this.roomPreviewer)
        {
            this.roomPreviewer.dispose();
        }

        this._inventoryFurnitureService.controller = null;
    }

    private prepareInventory(): void
    {
        if(!this._inventoryFurnitureService.isInitalized)
        {
            this._inventoryFurnitureService.requestLoad();
        }
        else
        {
            this.selectFirstGroup();
        }
    }

    public selectExistingGroupOrDefault(): void
    {
        if(this.selectedGroup)
        {
            const index = this._inventoryFurnitureService.groupItems.indexOf(this.selectedGroup);

            if(index > -1)
            {
                this.selectedGroup.selected = true;

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
        this._inventoryFurnitureService.unselectAllGroupItems();

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

    public getIconUrl(groupItem: GroupItem): string
    {
        const imageUrl = ((groupItem && groupItem.iconUrl) || null);

        if(imageUrl && (imageUrl !== '')) return `url('${ imageUrl }')`;

        return null;
    }

    public attemptItemPlacement(): void
    {
        if(this.tradeRunning) return;

        this._ngZone.runOutsideAngular(() => this._inventoryFurnitureService.attemptItemPlacement());
    }

    public attemptItemOffer(): void
    {
        if(!this.selectedGroup || !this.tradeRunning) return;

        this._inventoryTradingService.offerGroupItem(this.selectedGroup);
    }

    public get groupItems(): GroupItem[]
    {
        return this._inventoryFurnitureService.groupItems;
    }

    public get tradeRunning(): boolean
    {
        return this._inventoryTradingService.running;
    }
}