import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { NotificationService } from '../../notification/services/notification.service';
import { ModToolMainComponent } from '../components/main/main.component';
import { ModtoolRoomInfoEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolRoomInfoEvent';
import { ModtoolRequestRoomInfoComposer } from '../../../../client/nitro/communication/messages/outgoing/modtool/ModtoolRequestRoomInfoComposer';
import { RoomToolRoom } from '../components/room-tool/room-tool-room';
import { UserInfoEvent } from '../../../../client/nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { UserToolUser } from '../components/user-tool/user-tool-user';
import { ModtoolUserChatlogEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolUserChatlogEvent';
import { ModtoolUserChatlogParserVisit } from '../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserChatlogParserVisit';
import { ModtoolRoomChatlogEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolRoomChatlogEvent';
import { ModtoolRequestRoomChatlogComposer } from '../../../../client/nitro/communication/messages/outgoing/modtool/ModtoolRequestRoomChatlogComposer';
import { ModtoolRoomChatlogParser } from '../../../../client/nitro/communication/messages/parser/modtool/ModtoolRoomChatlogParser';
import { ChatlogToolChatlog } from '../components/chatlog-tool/chatlog-tool-chatlog';
import { ModtoolRequestUserChatlogComposer } from '../../../../client/nitro/communication/messages/outgoing/modtool/ModtoolRequestUserChatlogComposer';
import { ModtoolCallForHelpTopicsEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolCallForHelpTopicsEvent';
import { CallForHelpCategoryData } from '../../../../client/nitro/communication/messages/parser/modtool/utils/CallForHelpCategoryData';
import { ModtoolMainEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolMainEvent';
import { _Str_5018 } from '../../../../client/nitro/communication/messages/parser/modtool/utils/_Str_5018';
import { ModtoolReceivedRoomsUserEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolReceivedRoomsUserEvent';
import { ModtoolRoomVisitedData } from '../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolRoomVisitedData';

@Injectable()
export class ModToolService implements OnDestroy
{
    private _component: ModToolMainComponent;
    private _messages: IMessageEvent[];

    private _rooms: RoomToolRoom[] = [];
    private _users: UserToolUser[] = [];
    private _roomVisits: ModtoolUserChatlogParserVisit[];
    private _callForHelpCategories: CallForHelpCategoryData[];
    private _roomChatlogs: ChatlogToolChatlog[] = [];

    private _currentSelectedUser: UserToolUser = null;

    private _showModActionOnUser: boolean = false;
    private _showVisitedRoomsForUser: boolean = false;
    private _showSendUserMessage: boolean = false;


    private _Str_20687: _Str_5018 = null;
    private _userRoomVisitedData: ModtoolRoomVisitedData;

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
            new ModtoolRoomInfoEvent(this.onRoomInfoEvent.bind(this)),
            new UserInfoEvent(this.onUserInfoEvent.bind(this)),
            new ModtoolUserChatlogEvent(this.onModtoolUserChatlogEvent.bind(this)),
            new ModtoolRoomChatlogEvent(this.onModtoolRoomChatlogEvent.bind(this)),
            new ModtoolCallForHelpTopicsEvent(this.onModToolsCFHCategoriesEvent.bind(this)),
            new ModtoolMainEvent(this.onModtoolsMainEvent.bind(this)),
            new ModtoolReceivedRoomsUserEvent(this.onRoomsReceivedForUserEvent.bind(this))
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

    private onModtoolsMainEvent(event: ModtoolMainEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._Str_20687 = parser.data;
    }

    private onRoomsReceivedForUserEvent(event: ModtoolReceivedRoomsUserEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._userRoomVisitedData = parser.data;
    }

    private onModToolsCFHCategoriesEvent(event: ModtoolCallForHelpTopicsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._callForHelpCategories = parser.callForHelpCategories;
    }

    private onRoomInfoEvent(event: ModtoolRoomInfoEvent): void
    {
        if(!event) return;

        if(!Nitro.instance.sessionDataManager.isModerator) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._rooms.push(new RoomToolRoom(parser.id, parser.playerAmount, parser.name, parser.ownerName, parser.description, parser.owner));
        });

    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        const userInfo = event.getParser().userInfo;
        this._ngZone.run(() =>
        {
            this._users.push(new UserToolUser(userInfo.userId, userInfo.username));
        });
    }

    private onModtoolUserChatlogEvent(event: ModtoolUserChatlogEvent): void
    {
        this._ngZone.run(() =>
        {
            this._roomVisits = event.getParser().roomVisits;
        });
    }

    private onModtoolRoomChatlogEvent(event: ModtoolRoomChatlogEvent): void
    {
        this._ngZone.run(() =>
        {
            const parser = event.getParser();
            this._roomChatlogs.push(new ChatlogToolChatlog(parser.id, parser.name, parser.chatlogs));
        });
    }

    public openRoomTool(): void
    {
        const roomId = Nitro.instance.roomSessionManager.viewerSession.roomId;
        const room = this._rooms.find(r => r.id === roomId);
        if(room != null)
        {
            const index = this._rooms.indexOf(room);
            this.closeRoomTool(index);
        }
        else
        {
            Nitro.instance.communication.connection.send(new ModtoolRequestRoomInfoComposer(roomId));
        }
    }

    public closeRoomTool(index: number): void
    {
        this._rooms.splice(index, 1);
    }

    public openChatlogTool(): void
    {
        const viewerSession = Nitro.instance.roomSessionManager.viewerSession;
        if(viewerSession != null)
        {
            const found = this._roomChatlogs.find(c => c.id === viewerSession.roomId);
            if(found)
            {
                const index = this._roomChatlogs.indexOf(found);
                this.closeChatlogTool(index);
            }
            else
            {
                Nitro.instance.communication.connection.send(new ModtoolRequestRoomChatlogComposer(viewerSession.roomId));
            }
        }
    }

    public closeChatlogTool(index: number): void
    {
        this._roomChatlogs.splice(index, 1);
    }

    public openUserTool(): void
    {
        Nitro.instance.communication.connection.send(new ModtoolRequestUserChatlogComposer(1));
    }

    public closeUserTool(): void
    {
        if(!this._component) return;

        this._component.userToolVisible = false;
    }

    public closeRoomVisitedTool(): void
    {
        this._showVisitedRoomsForUser = false;
    }

    public get rooms(): RoomToolRoom[]
    {
        return this._rooms;
    }

    public get users(): UserToolUser[]
    {
        return this._users;
    }

    public get roomVisits(): ModtoolUserChatlogParserVisit[]
    {
        return this._roomVisits;
    }

    public get roomChatlogs(): ChatlogToolChatlog[]
    {
        return this._roomChatlogs;
    }

    public get isInRoom(): boolean
    {
        return this._rooms !== null;
    }

    public selectUser(webID: number, name: string, figure: string = null, gender: string = null): void
    {
        this._currentSelectedUser = new UserToolUser(webID, name, figure, gender);
    }

    public get selectedUser(): UserToolUser
    {
        return this._currentSelectedUser;
    }

    public get showModActionOnUser(): boolean
    {
        return this._showModActionOnUser;
    }

    public set showModActionOnUser(show: boolean)
    {
        this._showModActionOnUser = show;
    }

    public get showVisitedRoomsForUser(): boolean
    {
        return this._showVisitedRoomsForUser;
    }

    public set showVisitedRoomsForUser(show: boolean)
    {
        this._showVisitedRoomsForUser = show;
    }

    public get showSendUserMessage(): boolean
    {
        return this._showSendUserMessage;
    }

    public set showSendUserMessage(show: boolean)
    {
        this._showSendUserMessage = show;
    }

    public get callForHelpCategories(): CallForHelpCategoryData[]
    {
        return this._callForHelpCategories;
    }

    public get _Str_3325():_Str_5018
    {
        return this._Str_20687;
    }

    public get roomUserVisitedData(): ModtoolRoomVisitedData
    {
        return this._userRoomVisitedData;
    }
}
