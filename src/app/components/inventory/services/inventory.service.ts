import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { DesktopViewEvent } from '../../../../client/nitro/communication/messages/incoming/desktop/DesktopViewEvent';
import { RoomEnterEvent } from '../../../../client/nitro/communication/messages/incoming/room/access/RoomEnterEvent';
import { RoomInfoOwnerEvent } from '../../../../client/nitro/communication/messages/incoming/room/data/RoomInfoOwnerEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomSessionEvent } from '../../../../client/nitro/session/events/RoomSessionEvent';
import { RoomSessionPropertyUpdateEvent } from '../../../../client/nitro/session/events/RoomSessionPropertyUpdateEvent';
import { IRoomSession } from '../../../../client/nitro/session/IRoomSession';
import { IUnseenItemTracker } from '../IUnseenItemTracker';
import { UnseenItemTracker } from '../UnseenItemTracker';

@Injectable()
export class InventoryService implements OnDestroy
{
    private _messages: IMessageEvent[];
    private _roomSession: IRoomSession;
    private _isInRoom: boolean;
    private _petsAllowed: boolean;

    private _unseenTracker: IUnseenItemTracker;

    constructor(
        private ngZone: NgZone)
    {
        this.registerMessages();

        this._messages      = [];
        this._roomSession   = null;
        this._isInRoom      = false;
        this._petsAllowed   = false;

        this._unseenTracker = new UnseenItemTracker(Nitro.instance.communication, this);
    }

    public ngOnDestroy(): void
    {
        if(this._unseenTracker)
        {
            this._unseenTracker.dispose();

            this._unseenTracker = null;
        }

        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        if(this._messages) this.unregisterMessages();

        this.ngZone.runOutsideAngular(() =>
        {
            this._messages = [
                new RoomInfoOwnerEvent(this.onRoomInfoOwnerEvent.bind(this)),
                new DesktopViewEvent(this.triggerLeaveRoom.bind(this)),
                new RoomEnterEvent(this.triggerLeaveRoom.bind(this)),
            ];

            for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);

            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionPropertyUpdateEvent.RSDUE_ALLOW_PETS, this.onRoomSessionEvent.bind(this));
        });
    }

    private unregisterMessages(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            if(this._messages && this._messages.length)
            {
                for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

                this._messages = [];
            }

            Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
            Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
            Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionPropertyUpdateEvent.RSDUE_ALLOW_PETS, this.onRoomSessionEvent.bind(this));
        });
    }

    public refreshUnseen(): void
    {

    }

    private onRoomInfoOwnerEvent(event: RoomInfoOwnerEvent): void
    {
        if(!event) return;

        this.setRoomStatus(true);
    }

    private triggerLeaveRoom(event: IMessageEvent): void
    {
        if(!event) return;

        this.setRoomStatus(false);
        this.setPetStatus(false);
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomSessionEvent.STARTED:
                this._roomSession = event.session;
                return;
            case RoomSessionEvent.ENDED:
                this._roomSession = null;
                return;
            case RoomSessionPropertyUpdateEvent.RSDUE_ALLOW_PETS:
                this.setPetStatus(true);
                return;
        }
    }

    private setRoomStatus(flag: boolean): void
    {
        this.ngZone.run(() => (this._isInRoom = flag));
    }

    private setPetStatus(flag: boolean): void
    {
        this.ngZone.run(() => (this._petsAllowed = flag));
    }

    public get isInRoom(): boolean
    {
        return this._isInRoom;
    }

    public get petsAllowed(): boolean
    {
        return this._petsAllowed;
    }

    public get unseenTracker(): IUnseenItemTracker
    {
        return this._unseenTracker;
    }
}