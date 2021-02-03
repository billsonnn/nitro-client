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


@Component({
    selector: 'nitro-room-furniture-gift-opening-component',
    templateUrl: './present.template.html'
})
export class PresentFurniWidget extends ConversionTrackingWidget
{
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
    constructor(
        private _ngZone: NgZone)
    {
        super();

        this.onObjectUpdate   = this.onObjectUpdate.bind(this);
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
        // if(k.id == this._objectId)
        // {
        //     this._Str_2718();
        // }
        // if(k.id == this._placedItemId)
        // {
        //     if(this._placedInRoom)
        //     {
        //         this._placedInRoom = false;
        //         this._Str_22179();
        //     }
        // }
    }

    private  _Str_21234(k:RoomWidgetEcotronBoxDataUpdateEvent):void
    {
    // switch (k.type)
    // {
    //     case _Str_3072.RWEBDUE_PACKAGEINFO:
    //         this._Str_2718();
    //         return;
    // }
    }

    private onObjectUpdate(event: RoomWidgetPresentDataUpdateEvent): void
    {
        debugger;

        switch(event.type)
        {
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_PACKAGEINFO: {
                this._ngZone.run(() =>
                {
                    this._openedRequest = false;
                    this._objectId = event._Str_1577;
                    this._text = event.text;
                    this._controller = event.controller;
                    this._senderName = event._Str_22956;
                    this._senderFigure = event._Str_23105;
                    this._visible = true;
                });
            }
                break;
            case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_FLOOR: {
                //  if(!this._openedRequest) return;

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
        }
    }

    private _Str_10146(): void
    {
        if(this._objectId < 0) return;

        if(this._text)
        {
            const message = Nitro.instance.localization.getValueWithParameter('widget.furni.present.message_opened', 'product', this._text);
        }
    }


    public getTitle(): string
    {
        if(!this.hasMissingSenderName())
        {
            return Nitro.instance.localization.getValueWithParameter('widget.furni.present.window.title_from', 'name', this._senderName);
        }

        return '';
    }

    // see _Str_4649
    private hasMissingSenderName(): boolean
    {
        return this._senderName == null || this._senderName.length == 0;
    }



















    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'accept': {
                this._visible = false;
                this.messageListener.processWidgetMessage(new RoomWidgetPresentOpenMessage(RoomWidgetPresentOpenMessage.RWPOM_OPEN_PRESENT, this._objectId));
            }
                break;
            case 'return':
                break;
        }
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
}
