import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { AcceptFriendResultEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/AcceptFriendResultEvent';
import { FindFriendsProcessResultEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/FindFriendsProcessResultEvent';
import { FollowFriendFailedEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/FollowFriendFailedEvent';
import { FriendListFragmentEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/FriendListFragmentEvent';
import { FriendListUpdateEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/FriendListUpdateEvent';
import { FriendNotificationEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/FriendNotificationEvent';
import { FriendRequestsEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/FriendRequestsEvent';
import { HabboSearchResultEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/HabboSearchResultEvent';
import { InstantMessageErrorEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/InstantMessageErrorEvent';
import { MessageErrorEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/MessageErrorEvent';
import { MessengerInitEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/MessengerInitEvent';
import { MiniMailNewMessageEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/MiniMailNewMessageEvent';
import { MiniMailUnreadCountEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/MiniMailUnreadCountEvent';
import { NewConsoleMessageEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/NewConsoleMessageEvent';
import { NewFriendRequestEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/NewFriendRequestEvent';
import { RoomInviteErrorEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/RoomInviteErrorEvent';
import { RoomInviteEvent } from '../../../../client/nitro/communication/messages/incoming/friendlist/RoomInviteEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { NotificationService } from '../../notification/services/notification.service';
import { FriendListMainComponent } from '../components/main/main.component';

@Injectable()
export class FriendListService implements OnDestroy
{
    private _component: FriendListMainComponent;
    private _messages: IMessageEvent[];

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
            new AcceptFriendResultEvent(this.onAcceptFriendResultEvent.bind(this)),
            new FindFriendsProcessResultEvent(this.onFindFriendsProcessResultEvent.bind(this)),
            new FollowFriendFailedEvent(this.onFollowFriendFailedEvent.bind(this)),
            new FriendListFragmentEvent(this.onFriendListFragmentEvent.bind(this)),
            new FriendListUpdateEvent(this.onFriendListUpdateEvent.bind(this)),
            new FriendNotificationEvent(this.onFriendNotificationEvent.bind(this)),
            new FriendRequestsEvent(this.onFriendRequestsEvent.bind(this)),
            new HabboSearchResultEvent(this.onHabboSearchResultEvent.bind(this)),
            new InstantMessageErrorEvent(this.onInstantMessageErrorEvent.bind(this)),
            new MessageErrorEvent(this.onMessageErrorEvent.bind(this)),
            new MessengerInitEvent(this.onMessengerInitEvent.bind(this)),
            new MiniMailNewMessageEvent(this.onMiniMailNewMessageEvent.bind(this)),
            new MiniMailUnreadCountEvent(this.onMiniMailUnreadCountEvent.bind(this)),
            new NewConsoleMessageEvent(this.onNewConsoleMessageEvent.bind(this)),
            new NewFriendRequestEvent(this.onNewFriendRequestEvent.bind(this)),
            new RoomInviteErrorEvent(this.onRoomInviteErrorEvent.bind(this)),
            new RoomInviteEvent(this.onRoomInviteEvent.bind(this))
        ];

        for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
    }

    private unregisterMessages(): void
    {
        if(this._messages && this._messages.length)
        {
            for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);
        }
    }

    private onAcceptFriendResultEvent(event: AcceptFriendResultEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onFindFriendsProcessResultEvent(event: FindFriendsProcessResultEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onFollowFriendFailedEvent(event: FollowFriendFailedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onFriendListFragmentEvent(event: FriendListFragmentEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onFriendListUpdateEvent(event: FriendListUpdateEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onFriendNotificationEvent(event: FriendNotificationEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onFriendRequestsEvent(event: FriendRequestsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onHabboSearchResultEvent(event: HabboSearchResultEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onInstantMessageErrorEvent(event: InstantMessageErrorEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onMessageErrorEvent(event: MessageErrorEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onMessengerInitEvent(event: MessengerInitEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onMiniMailNewMessageEvent(event: MiniMailNewMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onMiniMailUnreadCountEvent(event: MiniMailUnreadCountEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onNewConsoleMessageEvent(event: NewConsoleMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onNewFriendRequestEvent(event: NewFriendRequestEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onRoomInviteErrorEvent(event: RoomInviteErrorEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onRoomInviteEvent(event: RoomInviteEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    public get component(): FriendListMainComponent
    {
        return this._component;
    }

    public set component(component: FriendListMainComponent)
    {
        this._component = component;
    }
}