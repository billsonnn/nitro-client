import { Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomObjectVariable } from '../../../../client/nitro/room/object/RoomObjectVariable';
import { RoomPreviewer } from '../../../../client/nitro/room/preview/RoomPreviewer';
import { Vector3d } from '../../../../client/room/utils/Vector3d';
import { FurniCategory } from '../enum/FurniCategory';
import { GroupItem } from '../items/GroupItem';
import { InventoryFurniService } from '../services/inventory.furni.service';

@Component({
	selector: '[nitro-inventory-furni-component]',
    template: `
    <div *ngIf="visible" class="nitro-inventory-furni-component">
        <div class="w-100" nitro-inventory-furni-search-component></div>
        <div class="d-flex">
            <div class="d-flex flex-grow-1" nitro-inventory-furni-grid-component [groupItems]="groupItems"></div>
            <div class="d-flex">
                <div nitro-room-preview-component [roomPreviewer]="roomPreviewer" [width]="170" [height]="130"></div>
            </div>
        </div>
    </div>`
})
export class InventoryFurniComponent implements OnInit, OnDestroy, OnChanges
{
    @Input()
    public visible: boolean = false;

    @Input()
    public roomPreviewer: RoomPreviewer = null;

    private _groupItemSubscription: Subscription;

    constructor(
        private inventoryFurniService: InventoryFurniService,
        private ngZone: NgZone) {}

    public ngOnInit(): void
    {
        if(!this._groupItemSubscription)
        {
            this._groupItemSubscription = this.inventoryFurniService
                .groupItemEmitter
                .subscribe((groupItem: GroupItem) => this.onGroupItemSelected(groupItem));
        }
    }

    public ngOnDestroy(): void
    {
        if(this._groupItemSubscription)
        {
            this._groupItemSubscription.unsubscribe();
        }
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.visible.previousValue;
        const next = changes.visible.currentValue;

        if(next && (prev !== next)) this.visibilityChanged();
    }

    private visibilityChanged(): void
    {
        if(this.visible)
        {
            this.inventoryFurniService.requestLoad();
        }
    }

    private onGroupItemSelected(groupItem: GroupItem): void
    {
        let furnitureItem = groupItem.getItemByIndex(0);

        if(!furnitureItem) return;

        this.ngZone.runOutsideAngular(() =>
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

                    floorType       = ((furnitureItem.category === FurniCategory._Str_3639) ? groupItem.stuffData.getLegacyString() : floorType);
                    wallType        = ((furnitureItem.category === FurniCategory._Str_3639) ? groupItem.stuffData.getLegacyString() : wallType);
                    landscapeType   = ((furnitureItem.category === FurniCategory._Str_3432) ? groupItem.stuffData.getLegacyString() : landscapeType);

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
                        this.roomPreviewer.addWallItemIntoRoom(groupItem.type, new Vector3d(90), furnitureItem.stuffData.getLegacyString());
                    }
                    else
                    {
                        this.roomPreviewer.updateRoomWallsAndFloorVisibility(false, true);
                        this.roomPreviewer.addFurnitureIntoRoom(groupItem.type, new Vector3d(90), groupItem.stuffData, (groupItem.extra.toString()))
                    }
                }
            }
        });
    }

    public get groupItems(): GroupItem[]
    {
        return this.inventoryFurniService.furniList;
    }
}