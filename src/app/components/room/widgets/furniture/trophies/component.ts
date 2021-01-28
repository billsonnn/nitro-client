import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '../../../../../../client/core/events/IEventDispatcher';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { FurnitureTrophyWidgetHandler } from '../../handlers/FurnitureTrophyWidgetHandler';
import { RoomWidgetTrophyUpdateEvent } from '../../events/RoomWidgetTrophyUpdateEvent';

@Component({
    selector: 'nitro-room-furniture-trophy',
    templateUrl: './template.html'
})
export class TrophyFurniComponent extends ConversionTrackingWidget
{
    private _visible: boolean       = false;
    public ownerName: string           = null;
    public trophyDate:string            = null;
    private _color:number           = null;
    public trophyMessage:string         = null;
    private _viewType:number        = null;

    constructor(
        private _ngZone: NgZone)
    {
        super();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;


        eventDispatcher.addEventListener(RoomWidgetTrophyUpdateEvent.TROPHY_DATA, this.onObjectUpdate.bind(this));
        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetTrophyUpdateEvent.TROPHY_DATA, this.onObjectUpdate);
        super.unregisterUpdateEvents(eventDispatcher);
    }

    public getTrophyColorclass(): string
    {
        if(this._color == 0) return 'trophy-gold';
        if(this._color == 1) return 'trophy-silver';
        if(this._color == 2) return 'trophy-bronze';
        return '';
    }

    private onObjectUpdate(event: RoomWidgetTrophyUpdateEvent): void
    {
        this.ownerName = event.name;
        this.trophyDate = event.date;
        this.trophyMessage = event.message;
        this._color = event.color -1;
        this._viewType = event.viewType;
        if(this._color < 0 || this._color > 2)
        {
            this._color = 0;
        }
        this.visible = true;
    }

    public get handler(): FurnitureTrophyWidgetHandler
    {
        return (this.widgetHandler as FurnitureTrophyWidgetHandler);
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
