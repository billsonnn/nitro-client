import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { GroupConfirmMemberRemoveEvent } from '../../../../client/nitro/communication/messages/incoming/group/GroupConfirmMemberRemoveEvent';
import { GroupInformationEvent } from '../../../../client/nitro/communication/messages/incoming/group/GroupInformationEvent';
import { RoomInfoEvent } from '../../../../client/nitro/communication/messages/incoming/room/data/RoomInfoEvent';
import { GroupConfirmRemoveMemberComposer } from '../../../../client/nitro/communication/messages/outgoing/group/GroupConfirmRemoveMemberComposer';
import { GroupInformationComposer } from '../../../../client/nitro/communication/messages/outgoing/group/GroupInformationComposer';
import { GroupJoinComposer } from '../../../../client/nitro/communication/messages/outgoing/group/GroupJoinComposer';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomSessionEvent } from '../../../../client/nitro/session/events/RoomSessionEvent';
import { NotificationService } from '../../notification/services/notification.service';
import { GroupInfoComponent } from '../components/group-info/group-info.component';
import { GroupRoomInfoComponent } from '../components/room-info/room-info.component';

@Injectable()
export class GroupsService implements OnDestroy
{
    private _messages: IMessageEvent[];

    private _roomInfoComponent: GroupRoomInfoComponent;
    private _groupInfoComponent: GroupInfoComponent;

    constructor(
        private _notificationService: NotificationService,
        private _ngZone: NgZone)
    {
        this._messages = [];

        this.onRoomSessionEvent = this.onRoomSessionEvent.bind(this);

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this.unregisterMessages();

            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent);

            this._messages = [
                new RoomInfoEvent(this.onRoomInfoEvent.bind(this)),
                new GroupInformationEvent(this.onGroupInformationEvent.bind(this)),
                new GroupConfirmMemberRemoveEvent(this.onGroupConfirmMemberRemoveEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent);

            if(this._messages && this._messages.length)
            {
                for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

                this._messages = [];
            }
        });
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomSessionEvent.ENDED:
                this._ngZone.run(() =>
                {
                    this._roomInfoComponent.clear();
                });
                return;
        }
    }

    private onRoomInfoEvent(event: RoomInfoEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
       
        this._ngZone.run(() => {
            this._roomInfoComponent.groupId          = parser.data.habboGroupId;
            this._roomInfoComponent.groupName        = parser.data.groupName;
            this._roomInfoComponent.groupBadgeCode   = parser.data.groupBadgeCode;
            this._roomInfoComponent.groupMember      = parser.isGroupMember;
        });

        Nitro.instance.communication.connection.send(new GroupInformationComposer(parser.data.habboGroupId, false));
    }

    private onGroupInformationEvent(event: GroupInformationEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(parser.flag || parser.id === this._groupInfoComponent.groupId)
        {
            this._ngZone.run(() => {
                this._groupInfoComponent.groupId                = parser.id;
                this._groupInfoComponent.groupName              = parser.title;
                this._groupInfoComponent.groupBadgeCode         = parser.badge;
                this._groupInfoComponent.groupDescription       = parser.description;
                this._groupInfoComponent.groupType              = parser.type;
                this._groupInfoComponent.groupMembershipType    = parser.membershipType;
                this._groupInfoComponent.groupCreationDate      = parser.createdAt;
                this._groupInfoComponent.groupOwnerName         = parser.ownerName;
                this._groupInfoComponent.groupMembersCount      = parser.membersCount;
                this._groupInfoComponent.groupHomeRoomId        = parser.roomId;
            });
        }
        
        if(this._roomInfoComponent.groupId !== parser.id) return;

        this._ngZone.run(() =>
        {
            this._roomInfoComponent.groupType             = parser.type;
            this._roomInfoComponent.groupMembershipType   = parser.membershipType;
        });
    }

    private onGroupConfirmMemberRemoveEvent(event: GroupConfirmMemberRemoveEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        let confirmationConfig = [];

        if(parser.userId === Nitro.instance.sessionDataManager.userId)
        {
            confirmationConfig = this._groupInfoComponent.confirmLeave();
        }
        
        this._notificationService.alertWithChoices(confirmationConfig[1], confirmationConfig[2], confirmationConfig[1]);
    }

    public getInfo(groupId: number): void
    {
        Nitro.instance.communication.connection.send(new GroupInformationComposer(groupId, true));
    }

    public join(groupId: number): void
    {
        if(this._roomInfoComponent.groupType === 0)
        {
            this._ngZone.run(() =>
            {
                this._roomInfoComponent.groupMember = true;
            });
        }
        
        Nitro.instance.communication.connection.send(new GroupJoinComposer(groupId));
    }

    public removeMember(groupId: number, memberId: number): void
    {
        Nitro.instance.communication.connection.send(new GroupConfirmRemoveMemberComposer(groupId, memberId));
    }

    public set groupRoomInfoComponent(component: GroupRoomInfoComponent)
    {
        this._roomInfoComponent = component;
    }

    public set groupInfoComponent(component: GroupInfoComponent)
    {
        this._groupInfoComponent = component;
    }
}