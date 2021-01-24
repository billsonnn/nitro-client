import { Options } from '@angular-slider/ngx-slider';
import { Component, NgZone } from '@angular/core';
import { ChooserWidgetBaseComponent } from '../base/component';
import { IEventDispatcher } from '../../../../../../client/core/events/IEventDispatcher';
import { RoomWidgetChooserContentEvent } from '../../events/RoomWidgetChooserContentEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetRequestWidgetMessage } from '../../messages/RoomWidgetRequestWidgetMessage';

@Component({
    selector: 'nitro-room-chooser-user',
    templateUrl: '../base/template.html'
})
export class UserChooserWidgetComponent extends ChooserWidgetBaseComponent
{

    constructor(
        protected _ngZone: NgZone)
    {
        super(_ngZone);
        this.title = 'widget.chooser.user.title';
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher)
    {
        if(eventDispatcher == null) return;

        eventDispatcher.addEventListener(RoomWidgetChooserContentEvent.RWCCE_USER_CHOOSER_CONTENT, this.initChooser.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this.updateList.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.USER_ADDED, this.updateList.bind(this));

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher)
    {
        if(eventDispatcher == null) return;

        eventDispatcher.removeEventListener(RoomWidgetChooserContentEvent.RWCCE_USER_CHOOSER_CONTENT, this.initChooser.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this.updateList.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.USER_ADDED, this.updateList.bind(this));

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private initChooser(event: RoomWidgetChooserContentEvent): void
    {
        if(event == null || event.items == null) return;

        this.populate(event.items);
        this._ngZone.run(() =>
        {
            if(!this.visible) this.visible = true;
        });
    }

    private updateList(event: RoomWidgetRoomObjectUpdateEvent): void
    {
        if(!this.visible) return;

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        setTimeout(function()
        {
            if(that.disposed) return;
            that.messageListener.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.RWRWM_USER_CHOOSER));
        }, 100);
    }


}
