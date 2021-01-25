import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '../../../../../../client/core/events/IEventDispatcher';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomWidgetDimmerStateUpdateEvent } from '../../events/RoomWidgetDimmerStateUpdateEvent';
import { RoomWidgetDimmerUpdateEvent } from '../../events/RoomWidgetDimmerUpdateEvent';
import { FurnitureDimmerWidgetHandler } from '../../handlers/FurnitureDimmerWidgetHandler';
import { RoomWidgetDimmerPreviewMessage } from '../../messages/RoomWidgetDimmerPreviewMessage';

@Component({
    selector: 'nitro-room-furniture-dimmer-component',
    template: `
    <div *ngIf="visible" [bringToTop] [draggable] dragHandle=".card-header" class="card nitro-room-furniture-dimmer-component">
        <div *ngIf="isLoading" class="card-loading-overlay"></div>
        <div class="card-header-container">
            <div class="card-header-overlay"></div>
            <div class="card-header">
                <div class="header-title">{{ ('widget.dimmer.title') | translate }}</div>
                <div class="header-close" (click)="hide()"><i class="fas fa-times"></i></div>
            </div>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-12">
                    data
                </div>
            </div>
            <div class="row">
                <div class="col-12 justify-space-between">
                    <button type="button" class="btn btn-primary">{{ 'widget.dimmer.button.apply' | translate }}</button>
                </div>
            </div>
        </div>
    </div>`
})
export class DimmerFurniComponent extends ConversionTrackingWidget
{
    private _visible: boolean       = false;
    private _dimmerState: number    = 0;
    private _effectId: number       = 0;
    private _color: number          = 0xFFFFFF;
    private _brightness: number     = 0xFF;

    constructor(
        private _ngZone: NgZone)
    {
        super();

        this.onDimmerPresetsEvent   = this.onDimmerPresetsEvent.bind(this);
        this.onDimmerHideEvent      = this.onDimmerHideEvent.bind(this);
        this.onDimmerStateEvent     = this.onDimmerStateEvent.bind(this);
    }
    
    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetDimmerUpdateEvent.RWDUE_PRESETS, this.onDimmerPresetsEvent);
        eventDispatcher.addEventListener(RoomWidgetDimmerUpdateEvent.RWDUE_HIDE, this.onDimmerHideEvent);
        eventDispatcher.addEventListener(RoomWidgetDimmerStateUpdateEvent.RWDSUE_DIMMER_STATE, this.onDimmerStateEvent);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetDimmerUpdateEvent.RWDUE_PRESETS, this.onDimmerPresetsEvent);
        eventDispatcher.removeEventListener(RoomWidgetDimmerUpdateEvent.RWDUE_HIDE, this.onDimmerHideEvent);
        eventDispatcher.removeEventListener(RoomWidgetDimmerStateUpdateEvent.RWDSUE_DIMMER_STATE, this.onDimmerStateEvent);

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private onDimmerPresetsEvent(event: RoomWidgetDimmerUpdateEvent): void
    {

    }

    private onDimmerHideEvent(event: RoomWidgetDimmerUpdateEvent): void
    {

    }

    private onDimmerStateEvent(event: RoomWidgetDimmerStateUpdateEvent): void
    {
        this._dimmerState   = event.state;
        this._effectId      = event._Str_6815;
        this._color         = event.color;
        this._brightness    = event._Str_5123;

        this.messageListener.processWidgetMessage(new RoomWidgetDimmerPreviewMessage(this._color, this._brightness, (this._effectId === 2)));
    }

    public get handler(): FurnitureDimmerWidgetHandler
    {
        return (this.widgetHandler as FurnitureDimmerWidgetHandler);
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