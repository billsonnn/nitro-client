import { Component, NgZone } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomWidgetTrophyUpdateEvent } from '../../events/RoomWidgetTrophyUpdateEvent';
import { IEventDispatcher } from '../../../../../../client/core/events/IEventDispatcher';
import { FurnitureStickieHandler } from '../../handlers/FurnitureStickieHandler';
import { RoomWidgetStickieDataUpdateEvent } from '../../events/RoomWidgetStickieDataUpdateEvent';
import { RoomWidgetUpdateEvent } from '../../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetStickieSendUpdateMessage } from '../../messages/RoomWidgetStickieSendUpdateMessage';

@Component({
    selector: 'nitro-room-furniture-sticky',
    templateUrl: './template.html'
})
export class StickieFurniComponent extends ConversionTrackingWidget
{
    private _visible: boolean       = false;

    protected  _objectId:number = -1;
    public  _text:string;
    public _colorHex:string;
    protected  _Str_2278:boolean;
    public isController: boolean = false;

    public readonly availableColors: string[] = ['9CCEFF','FF9CFF', '9CFF9C','FFFF33'];


    constructor(
        private _ngZone: NgZone)
    {
        super();

        this.stickieUpdateHandler = this.stickieUpdateHandler.bind(this);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetStickieDataUpdateEvent.RWSDUE_STICKIE_DATA, this.stickieUpdateHandler);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetStickieDataUpdateEvent.RWSDUE_STICKIE_DATA, this.stickieUpdateHandler);

        super.unregisterUpdateEvents(eventDispatcher);
    }

    public getHex(): string
    {
        return '#' + this._colorHex;
    }

    public getHexFromHtml(hex): string
    {
        return '#' + hex;
    }


    private stickieUpdateHandler(event: RoomWidgetUpdateEvent): void
    {
        if(!event) return;

        const stickieEvent = <RoomWidgetStickieDataUpdateEvent>event;
        if(!stickieEvent) return;


        this._Str_2718(false);
        this._objectId = stickieEvent._Str_1577;
        this._text = stickieEvent.text;
        this._colorHex = stickieEvent._Str_10471;
        this._Str_2278 = stickieEvent.controller;
        this.isController = stickieEvent.controller;
        debugger;
        this._ngZone.run(() =>
        {
            this._visible = true;
        });
    }

    private  _Str_2718(k: boolean = true): void
    {
        if(k) this.sendUpdate();

        this._objectId = -1;
        this._text = null;
        this._Str_2278 = false;
    }

    private sendUpdate(): void
    {
        if(this._objectId == -1) return;

        this.messageListener.processWidgetMessage(new RoomWidgetStickieSendUpdateMessage(RoomWidgetStickieSendUpdateMessage.SEND_UPDATE, this._objectId, this._text, this._colorHex));
    }

    private sendDelete(): void
    {
        if(this._objectId == -1) return;

        this.messageListener.processWidgetMessage(new RoomWidgetStickieSendUpdateMessage(RoomWidgetStickieSendUpdateMessage.SEND_DELETE, this._objectId));
    }

    public handleButton(button: string): void
    {
        if(!this.isController)
        {
            this._visible = false;
            return;
        }

        if(this.availableColors.includes(button))
        {
            this._colorHex = button;
            this.sendSetColor();
            return;
        }

        if(button == 'close')
        {
            this._visible = false;
            this._Str_2718(true);
            return;
        }

        if(button == 'delete')
        {
            this.sendDelete();
            this.visible = false;
            this._Str_2718(false);
        }
    }

    private sendSetColor(): void
    {
        this.messageListener.processWidgetMessage(new RoomWidgetStickieSendUpdateMessage(RoomWidgetStickieSendUpdateMessage.SEND_UPDATE, this._objectId, this._text, this._colorHex));
    }

    public get handler(): FurnitureStickieHandler
    {
        return (this.widgetHandler as FurnitureStickieHandler);
    }

    public get visible(): boolean
    {
        return this._visible;
    }


    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    public hide(): void
    {
        this._visible = false;
    }
}
