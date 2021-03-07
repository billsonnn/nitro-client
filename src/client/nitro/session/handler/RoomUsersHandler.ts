import { IConnection } from '../../../core/communication/connections/IConnection';
import { FriendRequestsEvent } from '../../communication/messages/incoming/friendlist/FriendRequestsEvent';
import { NewFriendRequestEvent } from '../../communication/messages/incoming/friendlist/NewFriendRequestEvent';
import { PetPlacingErrorEvent } from '../../communication/messages/incoming/notifications/PetPlacingErrorEvent';
import { RoomDoorbellEvent } from '../../communication/messages/incoming/room/access/doorbell/RoomDoorbellEvent';
import { RoomUnitDanceEvent } from '../../communication/messages/incoming/room/unit/RoomUnitDanceEvent';
import { RoomUnitEvent } from '../../communication/messages/incoming/room/unit/RoomUnitEvent';
import { RoomUnitInfoEvent } from '../../communication/messages/incoming/room/unit/RoomUnitInfoEvent';
import { RoomUnitRemoveEvent } from '../../communication/messages/incoming/room/unit/RoomUnitRemoveEvent';
import { UserCurrentBadgesEvent } from '../../communication/messages/incoming/user/data/UserCurrentBadgesEvent';
import { UserNameChangeMessageEvent } from '../../communication/messages/incoming/user/data/UserNameChangeMessageEvent';
import { RoomSessionDanceEvent } from '../events/RoomSessionDanceEvent';
import { RoomSessionDoorbellEvent } from '../events/RoomSessionDoorbellEvent';
import { RoomSessionErrorMessageEvent } from '../events/RoomSessionErrorMessageEvent';
import { RoomSessionFriendRequestEvent } from '../events/RoomSessionFriendRequestEvent';
import { RoomSessionUserBadgesEvent } from '../events/RoomSessionUserBadgesEvent';
import { RoomSessionUserDataUpdateEvent } from '../events/RoomSessionUserDataUpdateEvent';
import { IRoomHandlerListener } from '../IRoomHandlerListener';
import { RoomUserData } from '../RoomUserData';
import { BaseHandler } from './BaseHandler';

export class RoomUsersHandler extends BaseHandler
{
    constructor(connection: IConnection, listener: IRoomHandlerListener)
    {
        super(connection, listener);

        connection.addMessageEvent(new RoomUnitEvent(this.onRoomUnitEvent.bind(this)));
        connection.addMessageEvent(new RoomUnitInfoEvent(this.onRoomUnitInfoEvent.bind(this)));
        connection.addMessageEvent(new RoomUnitRemoveEvent(this.onRoomUnitRemoveEvent.bind(this)));
        connection.addMessageEvent(new RoomUnitDanceEvent(this.onRoomUnitDanceEvent.bind(this)));
        connection.addMessageEvent(new UserCurrentBadgesEvent(this.onUserCurrentBadgesEvent.bind(this)));
        connection.addMessageEvent(new RoomDoorbellEvent(this.onRoomDoorbellEvent.bind(this)));
        connection.addMessageEvent(new UserNameChangeMessageEvent(this.onUserNameChangeMessageEvent.bind(this)));
        connection.addMessageEvent(new FriendRequestsEvent(this.onFriendRequestsEvent.bind(this)));
        connection.addMessageEvent(new NewFriendRequestEvent(this.onNewFriendRequestEvent.bind(this)));
        connection.addMessageEvent(new PetPlacingErrorEvent(this.onPetPlacingError.bind(this)));
    }

    private onRoomUnitEvent(event: RoomUnitEvent): void
    {
        if(!this.listener) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        const users = event.getParser().users;

        const usersToAdd: RoomUserData[] = [];

        if(users && users.length)
        {
            for(const user of users)
            {
                if(!user) continue;

                const userData = new RoomUserData(user.roomIndex);

                userData.name                   = user.name;
                userData.custom                 = user.custom;
                userData.activityPoints         = user.activityPoints;
                userData.figure                 = user.figure;
                userData.type                   = user.userType;
                userData.webID                  = user.webID;
                userData.guildId                = user.groupID;
                userData.groupName              = user.groupName;
                userData.groupStatus            = user.groupStatus;
                userData.sex                    = user.sex;
                userData.ownerId                = user.ownerId;
                userData.ownerName              = user.ownerName;
                userData.rarityLevel            = user.rarityLevel;
                userData.hasSaddle              = user.hasSaddle;
                userData.isRiding               = user.isRiding;
                userData.canBreed               = user.canBreed;
                userData.canHarvest             = user.canHarvest;
                userData.canRevive              = user.canRevive;
                userData.hasBreedingPermission  = user.hasBreedingPermission;
                userData.petLevel               = user.petLevel;
                userData.botSkills              = user.botSkills;
                userData.isModerator            = user.isModerator;

                if(!session.userDataManager.getUserData(user.roomIndex)) usersToAdd.push(userData);

                session.userDataManager.updateUserData(userData);
            }
        }

        this.listener.events.dispatchEvent(new RoomSessionUserDataUpdateEvent(session, usersToAdd));
    }

    private onRoomUnitInfoEvent(event: RoomUnitInfoEvent): void
    {
        if(!this.listener) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        const parser = event.getParser();

        if(!parser) return;

        session.userDataManager.updateFigure(parser.unitId, parser.figure, parser.gender, false, false);
        session.userDataManager.updateMotto(parser.unitId, parser.motto);
    }

    private onRoomUnitRemoveEvent(event: RoomUnitRemoveEvent): void
    {
        if(!this.listener) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        session.userDataManager.removeUserData(event.getParser().unitId);
    }

    private onRoomUnitDanceEvent(event: RoomUnitDanceEvent): void
    {
        if(!this.listener) return;

        const parser = event.getParser();

        if(!parser) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        this.listener.events.dispatchEvent(new RoomSessionDanceEvent(session, parser.unitId, parser.danceId));
    }

    private onUserCurrentBadgesEvent(event: UserCurrentBadgesEvent): void
    {
        if(!this.listener) return;

        const parser = event.getParser();

        if(!parser) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        session.userDataManager.setUserBadges(parser.userId, parser.badges);

        this.listener.events.dispatchEvent(new RoomSessionUserBadgesEvent(session, parser.userId, parser.badges));
    }

    private onRoomDoorbellEvent(event: RoomDoorbellEvent): void
    {
        if(!this.listener) return;

        const parser = event.getParser();

        if(!parser) return;

        const username = parser.userName;

        if(!username || !username.length) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        this.listener.events.dispatchEvent(new RoomSessionDoorbellEvent(RoomSessionDoorbellEvent.DOORBELL, session, username));
    }

    private onUserNameChangeMessageEvent(event: UserNameChangeMessageEvent): void
    {
        if(!this.listener) return;

        const parser = event.getParser();

        if(!parser) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        session.userDataManager.updateName(parser.id, parser.newName);
    }

    private onFriendRequestsEvent(event: FriendRequestsEvent): void
    {
        if(!this.listener) return;

        const parser = event.getParser();

        if(!parser) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        for(const request of parser.requests) this.listener.events.dispatchEvent(new RoomSessionFriendRequestEvent(session, request.requestId, request.requesterUserId, request.requesterName));
    }

    private onNewFriendRequestEvent(event: NewFriendRequestEvent): void
    {
        if(!this.listener) return;

        const parser = event.getParser();

        if(!parser) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        const request = parser.request;

        this.listener.events.dispatchEvent(new RoomSessionFriendRequestEvent(session, request.requestId, request.requesterUserId, request.requesterName));
    }

    private onPetPlacingError(event: PetPlacingErrorEvent): void
    {
        if(!this.listener) return;

        const parser = event.getParser();

        if(!parser) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        let type = '';

        switch(parser.errorCode)
        {
            case 0:
                type = RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_HOTEL;
                break;
            case 1:
                type = RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_FLAT;
                break;
            case 2:
                type = RoomSessionErrorMessageEvent.RSEME_MAX_PETS;
                break;
            case 3:
                type = RoomSessionErrorMessageEvent.RSEME_NO_FREE_TILES_FOR_PET;
                break;
            case 4:
                type = RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_PET;
                break;
            case 5:
                type = RoomSessionErrorMessageEvent.RSEME_MAX_NUMBER_OF_OWN_PETS;
                break;
        }

        if(type && type.length)
            this.listener.events.dispatchEvent(new RoomSessionErrorMessageEvent(type, session));
    }
}
