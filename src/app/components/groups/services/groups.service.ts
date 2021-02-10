import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { GroupInformationEvent } from '../../../../client/nitro/communication/messages/incoming/group/GroupInformationEvent';
import { RoomInfoEvent } from '../../../../client/nitro/communication/messages/incoming/room/data/RoomInfoEvent';
import { GroupInformationComposer } from '../../../../client/nitro/communication/messages/outgoing/group/GroupInformationComposer';
import { GroupJoinComposer } from '../../../../client/nitro/communication/messages/outgoing/group/GroupJoinComposer';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomSessionEvent } from '../../../../client/nitro/session/events/RoomSessionEvent';

@Injectable()
export class GroupsService implements OnDestroy
{
    private _messages: IMessageEvent[];
    private _roomGroupId: number;
    private _roomGroupName: string;
    private _roomGroupBadgeCode: string;
    private _roomGroupType: number;
    private _roomGroupMembershipType: number;
    private _isRoomGroupMember: boolean;

    private _roomGroupInfoLoaded: boolean;

    constructor(
        private _ngZone: NgZone)
    {
        this._messages              = [];

        this._clear();

        this.onRoomSessionEvent = this.onRoomSessionEvent.bind(this);

        this.registerMessages();
    }

    private _clear(): void
    {
        this._roomGroupId               = 0;
        this._roomGroupName             = null;
        this._roomGroupBadgeCode        = null;
        this._roomGroupType             = 0;
        this._roomGroupMembershipType   = 0;
        this._isRoomGroupMember         = false;
        this._roomGroupInfoLoaded       = false;
    }

    public ngOnDestroy(): void
    {
        this._clear();
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
                new GroupInformationEvent(this.onGroupInformationEvent.bind(this))
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
                    this._clear();
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
            this._roomGroupId           = parser.data.habboGroupId;
            this._roomGroupName         = parser.data.groupName;
            this._roomGroupBadgeCode    = parser.data.groupBadgeCode;
        });

        this._isRoomGroupMember = parser.isGroupMember;

        Nitro.instance.communication.connection.send(new GroupInformationComposer(this._roomGroupId, false));
    }

    private onGroupInformationEvent(event: GroupInformationEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(this._roomGroupId !== parser.id) return;

        this._ngZone.run(() =>
        {
            this._roomGroupType             = parser.type;
            this._roomGroupMembershipType   = parser.membershipType;
            this._roomGroupInfoLoaded       = true;
        });
    }

    public join(groupId: number)
    {
        if(this._roomGroupType === 0)
        {
            this._ngZone.run(() =>
            {
                this._isRoomGroupMember = true;
            });
        }
        
        Nitro.instance.communication.connection.send(new GroupJoinComposer(groupId));
    }

    public get groupId(): number
    {
        return this._roomGroupId;
    }

    public get groupName(): string
    {
        return this._roomGroupName;
    }

    public get groupBadgeCode(): string
    {
        return this._roomGroupBadgeCode;
    }

    public get groupType(): number
    {
        return this._roomGroupType;
    }

    public get groupMembershipType(): number
    {
        return this._roomGroupMembershipType;
    }

    public get isGroupMember(): boolean
    {
        return this._isRoomGroupMember;
    }

    public get roomGroupInfoLoaded(): boolean
    {
        return this._roomGroupInfoLoaded;
    }
}