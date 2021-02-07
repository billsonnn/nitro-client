import { Options } from '@angular-slider/ngx-slider';
import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '../../../../../../client/core/events/IEventDispatcher';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomWidgetDimmerStateUpdateEvent } from '../../events/RoomWidgetDimmerStateUpdateEvent';
import { RoomWidgetDimmerUpdateEvent } from '../../events/RoomWidgetDimmerUpdateEvent';
import { FurnitureDimmerWidgetHandler } from '../../handlers/FurnitureDimmerWidgetHandler';
import { RoomWidgetPresentDataUpdateEvent } from '../../events/RoomWidgetPresentDataUpdateEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetEcotronBoxDataUpdateEvent } from '../../events/RoomWidgetEcotronBoxDataUpdateEvent';
import { TextureUtils } from '../../../../../../client/room/utils/TextureUtils';
import { RenderTexture } from 'pixi.js';
import { RoomWidgetPresentOpenMessage } from '../../messages/RoomWidgetPresentOpenMessage';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { ProductTypeEnum } from '../../../../catalog/enums/ProductTypeEnum';
import { FurniturePresentWidgetHandler } from '../../handlers/FurniturePresentWidgetHandler';
import { RoomObjectCategory } from '../../../../../../client/nitro/room/object/RoomObjectCategory';
import { FurniturePlacePaintComposer } from '../../../../../../client/nitro/communication/messages/outgoing/room/furniture/FurniturePlacePaintComposer';


@Component({
    selector: 'nitro-room-furniture-gift-opening-component',
    templateUrl: './present.template.html'
})
export class PresentFurniWidget extends ConversionTrackingWidget
{

    private static readonly FLOOR:string = 'floor';
    private static readonly WALLPAPER:string = 'wallpaper';
    private static readonly LANDSCAPE:string = 'landscape';

    private _visible: boolean       = false;
    private _openedRequest: boolean;
    private _objectId: number;
    private _text: string;
    private _controller: boolean;
    private _senderName: string;
    private _senderFigure: string;
    private _image: HTMLImageElement;
    private _classId: number;
    private _itemType: string;
    private _placedItemId: number;
    private _placedItemType: string;
    private _placedInRoom: boolean;
    public openedText: string;

    public isFloor = false;

    public view: string = '';

    constructor(
        private _ngZone: NgZone)
    {
        super();

        this.onObjectUpdate   = this.onObjectUpdate.bind(this);
        this._Str_4159        = this._Str_4159.bind(this);
        this._Str_21234       = this._Str_21234.bind(this);
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
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this._Str_4159);
        eventDispatcher.addEventListener(RoomWidgetEcotronBoxDataUpdateEvent.RWEBDUE_PACKAGEINFO, this._Str_21234);
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
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this._Str_4159);
        eventDispatcher.removeEventListener(RoomWidgetEcotronBoxDataUpdateEvent.RWEBDUE_PACKAGEINFO, this._Str_21234);

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

    private _Str_4159(k:RoomWidgetRoomObjectUpdateEvent):void
    {
        if(k.id == this._objectId)
        {
            this._Str_2718();
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

    private  _Str_21234(k:RoomWidgetEcotronBoxDataUpdateEvent):void
    {
        switch(k.type)
        {
            case RoomWidgetEcotronBoxDataUpdateEvent.RWEBDUE_PACKAGEINFO:
                this._Str_2718();
                return;
        }
    }

    private onObjectUpdate(event: RoomWidgetPresentDataUpdateEvent): void
    {
        switch(event.type)
        {
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_PACKAGEINFO: {
                this._ngZone.run(() =>
                {
                    this._Str_2718();
                    this._openedRequest = false;
                    this._objectId = event._Str_1577;
                    this._text = event.text;
                    this._controller = event.controller;
                    this._senderName = event._Str_22956;
                    this._senderFigure = event._Str_23105;
                    this._Str_3030();
                    this._Str_9278(event._Str_11625);

                });
            }
                break;
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_FLOOR: {
                debugger;
                if(!this._openedRequest) return;
                this.isFloor = true;
                this._objectId = event._Str_1577;
                this._classId = event.classId;
                this._itemType = event._Str_2887;
                this._text = event.text;
                this._controller = event.controller;
                this._placedItemId = event.placedItemId;
                this._placedItemType = event.placedItemType;
                this._placedInRoom = event._Str_4057;

                this._Str_10146();
                //his._Str_12806('packagecard_icon_floor');
            }
                break;
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_LANDSCAPE: {
                if(!this._openedRequest) return;

                this._objectId = event._Str_1577;
                this._classId = event.classId;
                this._itemType = event._Str_2887;
                this._text = event.text;
                this._controller = event.controller;
                this._placedItemId = event.placedItemId;
                this._placedItemType = event.placedItemType;
                this._placedInRoom = event._Str_4057;
                this._Str_10146();
                // this._Str_12806("packagecard_icon_landscape");
            }
                break;
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_WALLPAPER: {
                if(!this._openedRequest) return;
                this._objectId = event._Str_1577;
                this._classId = event.classId;
                this._itemType = event._Str_2887;
                this._text = event.text;
                this._controller = event.controller;
                this._placedItemId = event.placedItemId;
                this._placedItemType = event.placedItemType;
                this._placedInRoom = event._Str_4057;
                this._Str_10146();
                //this._Str_12806("packagecard_icon_wallpaper");
            }
                break;

            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_CLUB: {
                if(!this._openedRequest) return;
                this._objectId = event._Str_1577;
                this._classId = event.classId;
                this._itemType = event._Str_2887;
                this._text = event.text;
                this._controller = event.controller;
                this._Str_10146();
                //this._Str_12806("packagecard_icon_hc");
            }
                break;
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS: {

                if(!this._openedRequest) return;
                try
                {
                    this.isFloor = true;
                    this._objectId = event._Str_1577;
                    this._classId = event.classId;
                    this._itemType = event._Str_2887;
                    this._text = event.text;
                    this._controller = event.controller;
                    this._placedItemId = event.placedItemId;
                    this._placedItemType = event.placedItemType;
                    this._placedInRoom = event._Str_4057;
                    this._Str_10146();
                    this._Str_9278(event._Str_11625);
                }
                catch (e)
                {
                    debugger;
                }
            }
                break;
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_IMAGE: {
                if(!this._openedRequest) return;

                this._Str_9278(event._Str_11625);

            }
                break;
        }
    }

    private _Str_2718(): void
    {
        this._visible = false;
        if(!this._openedRequest)
        {
            this._objectId = -1;
        }

        this._text = '';
        this._controller = false;
    }

    private _Str_10146(): void
    {
        if(this._objectId < 0) return;

        if(this._text)
        {
            this.openedText = Nitro.instance.localization.getValueWithParameter('widget.furni.present.message_opened', 'product', this._text);
            if(this._Str_20493())
            {
                this.openedText = Nitro.instance.localization.getValueWithParameter('widget.furni.present.spaces.message_opened', 'product', this._text);
            }
        }

        this.view = 'present_opened';
        this._visible = true;
    }

    private _Str_20493(): boolean
    {
        let k = false;
        if(this._itemType == ProductTypeEnum.WALL)
        {
            const local2 = Nitro.instance.sessionDataManager.getWallItemData(this._classId);
            if(local2)
            {
                const local3 = local2.className;
                k = ((local3 == PresentFurniWidget.FLOOR) || (local3 == PresentFurniWidget.LANDSCAPE) || (local3 == PresentFurniWidget.WALLPAPER));
            }
        }

        return k;

    }


    // see _Str_4649
    private hasMissingSenderName(): boolean
    {
        return this._senderName == null || this._senderName.length == 0;
    }

    private _Str_16426(): void
    {
        if(this._openedRequest || this._objectId == -1 || !this._controller) return;

        this._openedRequest = true;
        this._Str_2718();
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

    private _Str_9278(furniImage: PIXI.Texture)
    {
        if(this._objectId < 0) return;

        // furniImage.baseTexture.orig;

    }

    private _Str_3030(): void
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
                this._Str_16426();
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

        this._Str_16305();
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

        this._Str_16305();
    }

    private _Str_16305(): void
    {
        this._openedRequest = false;
        this._placedItemId = -1;
        this._placedInRoom = false;
        this._Str_2718();
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
