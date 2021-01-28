import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '../../../../../../client/core/events/IEventDispatcher';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomWidgetDimmerStateUpdateEvent } from '../../events/RoomWidgetDimmerStateUpdateEvent';
import { RoomWidgetDimmerUpdateEvent } from '../../events/RoomWidgetDimmerUpdateEvent';
import { FurnitureDimmerWidgetHandler } from '../../handlers/FurnitureDimmerWidgetHandler';
import { RoomWidgetDimmerPreviewMessage } from '../../messages/RoomWidgetDimmerPreviewMessage';
import { FurnitureTrophyWidgetHandler } from '../../handlers/FurnitureTrophyWidgetHandler';

@Component({
    selector: 'nitro-room-furniture-dimmer-component',
    template: `
    <div *ngIf="visible" [bringToTop] [draggable] dragHandle=".card-header" class="card nitro-room-furniture-dimmer-component">
        <div class="card-header-container">
            <div class="card-header-overlay"></div>
            <div class="card-header">
                <div class="header-title">{{ ('widget.dimmer.title') | translate }}</div>
                <div class="header-close"><i class="fas fa-times"></i></div>
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
export class TrophyFurniComponent extends ConversionTrackingWidget
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


    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;
        super.unregisterUpdateEvents(eventDispatcher);
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
}
