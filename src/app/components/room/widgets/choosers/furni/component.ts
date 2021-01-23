import { Options } from '@angular-slider/ngx-slider';
import { Component, NgZone } from '@angular/core';
import { ChooserWidgetBaseComponent } from '../base/component';
import { IEventDispatcher } from '../../../../../../client/core/events/IEventDispatcher';
import { RoomWidgetChooserContentEvent } from '../../events/RoomWidgetChooserContentEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetRequestWidgetMessage } from '../../messages/RoomWidgetRequestWidgetMessage';

@Component({
    selector: 'nitro-room-chooser-furni',
    templateUrl: '../base/template.html'
})
export class FurniChooserWidgetComponent extends ChooserWidgetBaseComponent
{

    constructor(
        protected _ngZone: NgZone)
    {
        super(_ngZone);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher)
    {
        if(eventDispatcher == null) return;

        eventDispatcher.addEventListener(RoomWidgetChooserContentEvent.RWCCE_FURNI_CHOOSER_CONTENT, this.initList.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_ADDED, this.furniUpdated.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.furniUpdated.bind(this));

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher)
    {
        if(eventDispatcher == null) return;

        eventDispatcher.removeEventListener(RoomWidgetChooserContentEvent.RWCCE_FURNI_CHOOSER_CONTENT, this.initList.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_ADDED, this.furniUpdated.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.furniUpdated.bind(this));

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private initList(event: RoomWidgetChooserContentEvent): void
    {
        if(event == null || event.items == null) return;

        this.populate(event.items);
        this._ngZone.run(() =>
        {
            if(!this.visible) this.visible = true;
        });
    }

    private furniUpdated(event: RoomWidgetRoomObjectUpdateEvent): void
    {
        if(event == null || !this.visible) return;

        this.messageListener.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.RWRWM_FURNI_CHOOSER));
    }

}
