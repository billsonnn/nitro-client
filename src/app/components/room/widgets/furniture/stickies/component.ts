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

    protected  _Str_2319:number = -1;
    protected  _Str_3796:string;
    protected  _text:string;
    protected  _Str_3062:string;
    protected  _Str_2278:boolean;
    private  _Str_14561:object; //BitmapData;
    protected  _Str_18958:string = 'stickieui_container';

    constructor(
        private _ngZone: NgZone)
    {
        super();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetStickieDataUpdateEvent.RWSDUE_STICKIE_DATA, this.stickieUpdateHandler.bind(this));

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetStickieDataUpdateEvent.RWSDUE_STICKIE_DATA, this.stickieUpdateHandler);

        super.unregisterUpdateEvents(eventDispatcher);
    }


    private stickieUpdateHandler(event: RoomWidgetUpdateEvent): void
    {
        debugger;
        if(!event) return;

        const stickieEvent = <RoomWidgetStickieDataUpdateEvent>event;
        if(!stickieEvent) return;


        this._Str_2718(false);
        this._Str_2319 = stickieEvent._Str_1577;
        this._Str_3796 = stickieEvent.type;
        this._text = stickieEvent.text;
        this._Str_3062 = stickieEvent._Str_10471;
        this._Str_2278 = stickieEvent.controller;
        //this._Str_3030();
    }

    private  _Str_2718(k: boolean = true): void
    {
        if(k) this.sendUpdate();

        this._Str_2319 = -1;
        this._text = null;
        this._Str_2278 = false;
    }


    private sendUpdate(): void
    {
        if(this._Str_2319 == -1) return;

        this.messageListener.processWidgetMessage(new RoomWidgetStickieSendUpdateMessage(RoomWidgetStickieSendUpdateMessage.SEND_UPDATE, this._Str_2319, this._text, this._Str_3062));
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
