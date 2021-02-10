import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '../../../../../../client/core/events/IEventDispatcher';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { FurnitureDimmerWidgetHandler } from '../../handlers/FurnitureDimmerWidgetHandler';
import { RoomWidgetPresentDataUpdateEvent } from '../../events/RoomWidgetPresentDataUpdateEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetEcotronBoxDataUpdateEvent } from '../../events/RoomWidgetEcotronBoxDataUpdateEvent';
import { RoomWidgetPresentOpenMessage } from '../../messages/RoomWidgetPresentOpenMessage';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { ProductTypeEnum } from '../../../../catalog/enums/ProductTypeEnum';
import { FurniturePresentWidgetHandler } from '../../handlers/FurniturePresentWidgetHandler';
import { RoomObjectCategory } from '../../../../../../client/nitro/room/object/RoomObjectCategory';
import { IFurnitureData } from '../../../../../../client/nitro/session/furniture/IFurnitureData';
import { CatalogService } from '../../../../catalog/services/catalog.service';


@Component({
    selector: 'nitro-room-furniture-gift-opening-component',
    templateUrl: './present.template.html'
})
export class PresentFurniWidget extends ConversionTrackingWidget
{

    private static readonly FLOOR:string = 'floor';
    private static readonly WALLPAPER:string = 'wallpaper';
    private static readonly LANDSCAPE:string = 'landscape';

    public option: string;

    private _visible: boolean       = false;
    private _openedRequest: boolean;
    private _objectId: number;
    private _text: string;
    private _controller: boolean;
    private _senderName: string;
    private _senderFigure: string;
    private _classId: number;
    private _itemType: string;
    private _placedItemId: number;
    private _placedItemType: string;
    private _placedInRoom: boolean;
    public openedText: string;

    public isFloor = false;

    public view: string = '';

    constructor(
        private _ngZone: NgZone,
        private _catalogService: CatalogService)
    {
        super();

        this.onObjectUpdate   = this.onObjectUpdate.bind(this);
        this.onFurniRemoved        = this.onFurniRemoved.bind(this);
        this.onPackageInfo       = this.onPackageInfo.bind(this);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;


        eventDispatcher.addEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_PACKAGEINFO, this.onObjectUpdate);
        eventDispatcher.addEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS, this.onObjectUpdate);
        eventDispatcher.addEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_IMAGE, this.onObjectUpdate);
        eventDispatcher.addEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_CLUB, this.onObjectUpdate);
        eventDispatcher.addEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_FLOOR, this.onObjectUpdate);
        eventDispatcher.addEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_LANDSCAPE, this.onObjectUpdate);
        eventDispatcher.addEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_WALLPAPER, this.onObjectUpdate);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.onFurniRemoved);
        eventDispatcher.addEventListener(RoomWidgetEcotronBoxDataUpdateEvent.RWEBDUE_PACKAGEINFO, this.onPackageInfo);
        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_PACKAGEINFO, this.onObjectUpdate);
        eventDispatcher.removeEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS, this.onObjectUpdate);
        eventDispatcher.removeEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_IMAGE, this.onObjectUpdate);
        eventDispatcher.removeEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_CLUB, this.onObjectUpdate);
        eventDispatcher.removeEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_FLOOR, this.onObjectUpdate);
        eventDispatcher.removeEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_LANDSCAPE, this.onObjectUpdate);
        eventDispatcher.removeEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_WALLPAPER, this.onObjectUpdate);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.onFurniRemoved);
        eventDispatcher.removeEventListener(RoomWidgetEcotronBoxDataUpdateEvent.RWEBDUE_PACKAGEINFO, this.onPackageInfo);

        super.unregisterUpdateEvents(eventDispatcher);
    }
    public get figure(): string
    {
        return this._senderFigure;
    }

    public get senderText(): string
    {
        return this._text;
    }

    public get senderName(): string
    {
        return this._senderName;
    }

    private onFurniRemoved(k:RoomWidgetRoomObjectUpdateEvent):void
    {
        if(!k) return;

        if(k.id == this._objectId)
        {
            this.closeView();
        }
        if(k.id == this._placedItemId)
        {
            if(this._placedInRoom)
            {
                this._placedInRoom = false;
                //.     this._Str_22179();
            }
        }
    }

    private  onPackageInfo(k:RoomWidgetEcotronBoxDataUpdateEvent):void
    {
        switch(k.type)
        {
            case RoomWidgetEcotronBoxDataUpdateEvent.RWEBDUE_PACKAGEINFO:
                this.closeView();
                return;
        }
    }

    private onObjectUpdate(event: RoomWidgetPresentDataUpdateEvent): void
    {
        if(!event) return;

        this.option = event.type;

        this._objectId = event.objectId;

        switch(event.type)
        {
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_PACKAGEINFO: {
                this._ngZone.run(() =>
                {
                    this.closeView();
                    this._openedRequest = false;

                    this._text = event.text;
                    this._controller = event.controller;
                    this._senderName = event.purchaserName;
                    this._senderFigure = event.purchaserFigure;
                    this.showOpeningPresent();
                });
            }
                break;
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_FLOOR: {
                if(!this._openedRequest) return;
                this.isFloor = true;

                this._classId = event.classId;
                this._itemType = event.itemType;
                this._text = event.text;
                this._controller = event.controller;
                this._placedItemId = event.placedItemId;
                this._placedItemType = event.placedItemType;
                this._placedInRoom = event.placedInRoom;

                this.setOpenedText();
                //his._Str_12806('packagecard_icon_floor');
            }
                break;
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_LANDSCAPE: {
                if(!this._openedRequest) return;


                this._classId = event.classId;
                this._itemType = event.itemType;
                this._text = event.text;
                this._controller = event.controller;
                this._placedItemId = event.placedItemId;
                this._placedItemType = event.placedItemType;
                this._placedInRoom = event.placedInRoom;
                this.setOpenedText();
                // this._Str_12806("packagecard_icon_landscape");
            }
                break;
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_WALLPAPER: {
                if(!this._openedRequest) return;

                this._classId = event.classId;
                this._itemType = event.itemType;
                this._text = event.text;
                this._controller = event.controller;
                this._placedItemId = event.placedItemId;
                this._placedItemType = event.placedItemType;
                this._placedInRoom = event.placedInRoom;
                this.isFloor = false;
                this.setOpenedText();
                //this._Str_12806("packagecard_icon_wallpaper");
            }
                break;

            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_CLUB: {
                if(!this._openedRequest) return;
                this._classId = event.classId;
                this._itemType = event.itemType;
                this._text = event.text;
                this._controller = event.controller;
                this.setOpenedText();
                //this._Str_12806("packagecard_icon_hc");
            }
                break;
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS: {

                if(!this._openedRequest) return;

                this.isFloor = true;
                this._objectId = event.objectId;
                this._classId = event.classId;
                this._itemType = event.itemType;
                this._text = event.text;
                this._controller = event.controller;
                this._placedItemId = event.placedItemId;
                this._placedItemType = event.placedItemType;
                this._placedInRoom = event.placedInRoom;
                this.setOpenedText();
            }
                break;
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_IMAGE: {
                if(!this._openedRequest) return;

            }
                break;
        }
    }

    private closeView(): void
    {
        this._visible = false;
        if(!this._openedRequest)
        {
            this._objectId = -1;
        }

        this._text = '';
        this._controller = false;
    }

    private setOpenedText(): void
    {
        if(this._objectId < 0) return;

        if(this._text)
        {
            this.openedText = Nitro.instance.localization.getValueWithParameter('widget.furni.present.message_opened', 'product', this._text);
            if(this.isSpacesFurniture())
            {
                this.openedText = Nitro.instance.localization.getValueWithParameter('widget.furni.present.spaces.message_opened', 'product', this._text);
            }
        }

        this.view = 'present_opened';
        this._visible = true;
    }

    private isSpacesFurniture(): boolean
    {
        let isSpaces = false;
        if(this._itemType == ProductTypeEnum.WALL)
        {
            const wallItemData = Nitro.instance.sessionDataManager.getWallItemData(this._classId);
            if(wallItemData)
            {
                const className = wallItemData.className;
                isSpaces = ((className == PresentFurniWidget.FLOOR) || (className == PresentFurniWidget.LANDSCAPE) || (className == PresentFurniWidget.WALLPAPER));
            }
        }

        return isSpaces;

    }

    public getFurniPicture(): string
    {
        let furniData: IFurnitureData = null;

        if(this.option == RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS)
        {
            furniData = Nitro.instance.sessionDataManager.getFloorItemData(this.classId);
        }
        else
        {
            furniData = Nitro.instance.sessionDataManager.getWallItemData(this.classId);
        }

        return this._catalogService.getFurnitureDataIconUrl(furniData);
    }


    // see _Str_4649
    private hasMissingSenderName(): boolean
    {
        return this._senderName == null || this._senderName.length == 0;
    }

    private acceptAndOpenPresent(): void
    {
        if(this._openedRequest || this._objectId == -1 || !this._controller) return;

        this._openedRequest = true;
        this.closeView();
        this.messageListener.processWidgetMessage(new RoomWidgetPresentOpenMessage(RoomWidgetPresentOpenMessage.RWPOM_OPEN_PRESENT, this._objectId));
    }



    public get handler(): FurnitureDimmerWidgetHandler
    {
        return (this.widgetHandler as FurnitureDimmerWidgetHandler);
    }

    public hide(): void
    {
        this._visible = false;
    }
    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }


    private showOpeningPresent(): void
    {

        if(this._objectId < 0) return;

        this.view = 'open_present';
        this._visible = true;
    }

    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'accept':
                this.acceptAndOpenPresent();
                break;
            case 'return':
                break;
            case 'furni_place_in_room':
                this.placeItemInRoom();
                break;
            case 'furni_place_in_inventory':
                this.placeFurniInInventory();
                break;
        }
    }

    private placeItemInRoom()
    {
        if(this._placedItemId > 0 && !this._placedInRoom)
        {
            const local3 = null;
            switch(this._placedItemType)
            {
                case ProductTypeEnum.FLOOR:

                    //   Nitro.instance.communication.connection.send(new FurniturePlacePaintComposer(this._placedItemId));
                    // _local_3 = this._inventory._Str_18856(-(this._placedItemId));
                    // if (this._Str_5337(_local_3))
                    // {
                    //     this._inventory._Str_7938(this._placedItemId);
                    // }
                    break;
                case ProductTypeEnum.WALL:
                    // _local_3 = this._inventory._Str_14082(this._placedItemId);
                    // if (this._Str_5337(_local_3))
                    // {
                    //     this._inventory._Str_7938(this._placedItemId);
                    // }
                    break;
                case ProductTypeEnum.PET:
                    // if (this._inventory._Str_6675(this._placedItemId, false))
                    // {
                    //     this._inventory._Str_21312(this._placedItemId);
                    // }
                    break;

            }
        }

        this.resetAndCloseView();
    }

    private placeFurniInInventory(): void
    {
        if(this._placedItemId > 0 && this._placedInRoom)
        {
            if(this._placedItemType == ProductTypeEnum.PET)
            {
                (this.widgetHandler as FurniturePresentWidgetHandler).container.roomSession.pickupPet(this._placedItemId);
            }
            else
            {
                const roomId = (this.widgetHandler as FurniturePresentWidgetHandler).container.roomSession.roomId;

                const roomObject = (this.widgetHandler as FurniturePresentWidgetHandler).container.roomEngine.getRoomObject(roomId, this._placedItemId, RoomObjectCategory.FLOOR);

                if(roomObject)
                {
                    //this._roomEngine.updateObjectWallItemData(_local_5.getId(), _local_4, RoomObjectOperationEnum.OBJECT_PICKUP);
                }
            }
        }

        this.resetAndCloseView();
    }

    private resetAndCloseView(): void
    {
        this._openedRequest = false;
        this._placedItemId = -1;
        this._placedInRoom = false;
        this.closeView();
    }

    public get isAnonymousGift(): boolean
    {
        return !this.senderName || this.senderName.length == 0;
    }

    public getGiftTitle(): string
    {
        if(this.isAnonymousGift)
        {
            return 'widget.furni.present.window.title';
        }

        return 'widget.furni.present.window.title_from';
    }

    public get classId(): number
    {
        return this._classId;
    }
}
