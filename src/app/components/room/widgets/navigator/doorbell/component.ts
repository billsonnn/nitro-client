import { Component, NgZone, OnDestroy } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { IEventDispatcher } from '../../../../../../client/core/events/IEventDispatcher';
import { RoomWidgetDoorbellEvent } from '../../events/RoomWidgetDoorbellEvent';
import { RoomWidgetLetUserInMessage } from '../../messages/RoomWidgetLetUserInMessage';


@Component({
    selector: 'nitro-room-doorbell-component',
    templateUrl: './template.html'
})
export class DoorbellWidgetComponent extends ConversionTrackingWidget
{
    private _visible: boolean = false;
    public _users:string[] = [];
    constructor(
        private _ngZone: NgZone)
    {
        super();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher)
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetDoorbellEvent.RWDE_RINGING, this.onRoomRinging.bind(this));
        eventDispatcher.addEventListener(RoomWidgetDoorbellEvent.REJECTED, this.onRoomAcceptedAndRejected.bind(this));
        eventDispatcher.addEventListener(RoomWidgetDoorbellEvent.RWDE_ACCEPTED, this.onRoomAcceptedAndRejected.bind(this));

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher)
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetDoorbellEvent.RWDE_RINGING, this.onRoomRinging);
        eventDispatcher.removeEventListener(RoomWidgetDoorbellEvent.REJECTED, this.onRoomAcceptedAndRejected);
        eventDispatcher.removeEventListener(RoomWidgetDoorbellEvent.RWDE_ACCEPTED, this.onRoomAcceptedAndRejected);
        super.unregisterUpdateEvents(eventDispatcher);
    }


    private onRoomRinging(event: RoomWidgetDoorbellEvent): void
    {
        this.addUser(event.userName);
    }

    private onRoomAcceptedAndRejected(event: RoomWidgetDoorbellEvent): void
    {
        this.removeUser(event.userName);
    }

    private addUser(user: string): void
    {
        this._ngZone.run(() =>
        {
            this._visible = true;
        });

        if(this._users.indexOf(user) > -1) return;

        if(this._users.length >= 50)
        {
            this.deny(user);
            return;
        }

        this._ngZone.run(() =>
        {
            this._users.push(user);
        });

    }

    private removeUser(user: string): void
    {
        if(this._users.indexOf(user) == -1) return;

        const index = this._users.indexOf(user);
        if(index < 0) return;

        this._ngZone.run(() =>
        {
            this._users = this._users.filter(_usr => _usr != user);
            if(this._users.length == 0)
            {
                this._visible = false;
            }
        });
    }

    public deny(user: string): void
    {
        this.messageListener.processWidgetMessage( new RoomWidgetLetUserInMessage(user, false));
        this.removeUser(user);
    }

    public accept(user: string): void
    {
        this.messageListener.processWidgetMessage( new RoomWidgetLetUserInMessage(user, true));
        this.removeUser(user);
    }

    public hide(): void
    {
        this._visible = false;
    }

    public get visible(): boolean
    {
        return this._visible;
    }
}
