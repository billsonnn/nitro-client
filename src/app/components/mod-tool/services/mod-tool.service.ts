import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { CallForHelpResultMessageEvent } from '../../../../client/nitro/communication/messages/incoming/help/CallForHelpResultMessageEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { NotificationService } from '../../notification/services/notification.service';
import { ModToolMainComponent } from '../components/main/main.component';
import { ModtoolRoomInfoEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolRoomInfoEvent';
import { DesktopViewEvent } from '../../../../client/nitro/communication/messages/incoming/desktop/DesktopViewEvent';
import { RoomEnterEvent } from '../../../../client/nitro/communication/messages/incoming/room/access/RoomEnterEvent';
import { ModtoolRequestRoomInfoComposer } from '../../../../client/nitro/communication/messages/outgoing/modtool/ModtoolRequestRoomInfoComposer';
import {RoomToolRoom} from "../components/room-tool/room-tool-room";

@Injectable()
export class ModToolService implements OnDestroy
{
    private _component: ModToolMainComponent;
    private _messages: IMessageEvent[];

    private _isInRoom: boolean;
    private _room: RoomToolRoom;

    constructor(
        private _notificationService: NotificationService,
        private _ngZone: NgZone)
    {
        this._component = null;

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        if(this._messages) this.unregisterMessages();

        this._messages = [
        	new DesktopViewEvent(this.onDesktopViewEvent.bind(this)),
            new RoomEnterEvent(this.onRoomEnterEvent.bind(this)),
            new ModtoolRoomInfoEvent(this.onRoomInfoEvent.bind(this)),
        ];

        for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
    }

    private unregisterMessages(): void
    {
        if(this._messages && this._messages.length)
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);
        }
    }

    public get component(): ModToolMainComponent
    {
        return this._component;
    }

    public set component(component: ModToolMainComponent)
    {
        this._component = component;
    }

    private onRoomInfoEvent(event: ModtoolRoomInfoEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        this._room = new RoomToolRoom(parser.id, parser.name, parser.ownerName)
        if(!parser) return;
    }

    private onDesktopViewEvent(event: DesktopViewEvent): void
    {
    	this._room = null;
    }

    private onRoomEnterEvent(event: RoomEnterEvent): void
    {
        Nitro.instance.communication.connection.send(new ModtoolRequestRoomInfoComposer(Nitro.instance.roomSessionManager.viewerSession.roomId));
    }

    public get isInRoom(): boolean
	{
		return this._room !== null;
	}

	public get roomId(): number
	{
		return this._room ? this._room.id : null;
	}

    public get roomName(): string
    {
        return this._room ? this._room.name : null;
    }

    public get roomOwnerName(): string
    {
        return this._room ? this._room.ownerName : null;
    }
}
