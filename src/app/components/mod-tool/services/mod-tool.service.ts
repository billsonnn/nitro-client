import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { NotificationService } from '../../notification/services/notification.service';
import { ModToolMainComponent } from '../components/main/main.component';
import { ModtoolRoomInfoEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolRoomInfoEvent';
import { DesktopViewEvent } from '../../../../client/nitro/communication/messages/incoming/desktop/DesktopViewEvent';
import { RoomEnterEvent } from '../../../../client/nitro/communication/messages/incoming/room/access/RoomEnterEvent';
import { ModtoolRequestRoomInfoComposer } from '../../../../client/nitro/communication/messages/outgoing/modtool/ModtoolRequestRoomInfoComposer';
import { RoomToolRoom } from '../components/room-tool/room-tool-room';
import { UserInfoEvent } from '../../../../client/nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { UserToolUser } from '../components/user-tool/user-tool-user';
import { ModtoolUserChatlogEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolUserChatlogEvent';
import { ModtoolRequestUserChatlogComposer } from '../../../../client/nitro/communication/messages/outgoing/modtool/ModtoolRequestUserChatlogComposer';
import { ModtoolUserChatlogParserVisit } from '../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserChatlogParserVisit';
import { ModtoolRoomChatlogEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolRoomChatlogEvent';
import { ModtoolRequestRoomChatlogComposer } from '../../../../client/nitro/communication/messages/outgoing/modtool/ModtoolRequestRoomChatlogComposer';
import { ModtoolRoomChatlogLine } from '../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolRoomChatlogLine';

@Injectable()
export class ModToolService implements OnDestroy
{
    private _component: ModToolMainComponent;
    private _messages: IMessageEvent[];

    private _room: RoomToolRoom = null;
    private _user: UserToolUser = null;
    private _roomVisits: ModtoolUserChatlogParserVisit[];
    private _roomChatlogs: ModtoolRoomChatlogLine[];

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
            new UserInfoEvent(this.onUserInfoEvent.bind(this)),
            new ModtoolUserChatlogEvent(this.onModtoolUserChatlogEvent.bind(this)),
            new ModtoolRoomChatlogEvent(this.onModtoolRoomChatlogEvent.bind(this))
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

        if(!Nitro.instance.sessionDataManager.isModerator) return;

        const parser = event.getParser();

        this._room = new RoomToolRoom(parser.id, parser.playerAmount, parser.name, parser.ownerName, parser.description, parser.owner);
        if(!parser) return;
    }

    private onDesktopViewEvent(event: DesktopViewEvent): void
    {
        if(!Nitro.instance.sessionDataManager.isModerator) return;

        this._room = null;
    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        const userInfo = event.getParser().userInfo;
        this._user = new UserToolUser(userInfo.userId, userInfo.username);
    }

    private onRoomEnterEvent(event: RoomEnterEvent): void
    {
        if(!Nitro.instance.sessionDataManager.isModerator) return;

        const roomId = Nitro.instance.roomSessionManager.viewerSession.roomId;
        Nitro.instance.communication.connection.send(new ModtoolRequestUserChatlogComposer(1));
        Nitro.instance.communication.connection.send(new ModtoolRequestRoomInfoComposer(roomId));
        Nitro.instance.communication.connection.send(new ModtoolRequestRoomChatlogComposer(roomId));
    }

    private onModtoolUserChatlogEvent(event: ModtoolUserChatlogEvent): void
    {
        this._roomVisits = event.getParser().roomVisits;
    }

    private onModtoolRoomChatlogEvent(event: ModtoolRoomChatlogEvent): void
    {
        this._roomChatlogs = event.getParser().chatlogs;
    }

    public get room(): RoomToolRoom
    {
        return this._room;
    }

    public get user(): UserToolUser
    {
        return this._user;
    }

    public get roomVisits(): ModtoolUserChatlogParserVisit[]
    {
        return this._roomVisits;
    }

    public get roomChatlogs(): ModtoolRoomChatlogLine[]
    {
        return this._roomChatlogs;
    }

    public get isInRoom(): boolean
    {
        return this._room !== null;
    }
}
