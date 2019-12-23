import { IMessageConfiguration } from '../../core/communication/messages/IMessageConfiguration';
import { ClientPingEvent } from './messages/incoming/client/ClientPingEvent';
import { DesktopViewEvent } from './messages/incoming/desktop/DesktopViewEvent';
import { IncomingHeader } from './messages/incoming/IncomingHeader';
import { RoomEnterEvent } from './messages/incoming/room/access/RoomEnterEvent';
import { RoomFowardEvent } from './messages/incoming/room/access/RoomFowardEvent';
import { RoomChatSettingsEvent } from './messages/incoming/room/data/RoomChatSettingsEvent';
import { RoomInfoEvent } from './messages/incoming/room/data/RoomInfoEvent';
import { RoomInfoOwnerEvent } from './messages/incoming/room/data/RoomInfoOwnerEvent';
import { RoomScoreEvent } from './messages/incoming/room/data/RoomScoreEvent';
import { RoomSettingsErrorEvent } from './messages/incoming/room/data/RoomSettingsErrorEvent';
import { RoomSettingsEvent } from './messages/incoming/room/data/RoomSettingsEvent';
import { RoomSettingsSavedEvent } from './messages/incoming/room/data/RoomSettingsSavedEvent';
import { RoomSettingsUpdatedEvent } from './messages/incoming/room/data/RoomSettingsUpdatedEvent';
import { FurnitureFloorAddEvent } from './messages/incoming/room/furniture/floor/FurnitureFloorAddEvent';
import { FurnitureFloorEvent } from './messages/incoming/room/furniture/floor/FurnitureFloorEvent';
import { FurnitureFloorRemoveEvent } from './messages/incoming/room/furniture/floor/FurnitureFloorRemoveEvent';
import { FurnitureFloorUpdateEvent } from './messages/incoming/room/furniture/floor/FurnitureFloorUpdateEvent';
import { FurnitureDataEvent } from './messages/incoming/room/furniture/FurnitureDataEvent';
import { FurnitureStateEvent } from './messages/incoming/room/furniture/FurnitureStateEvent';
import { FurnitureWallAddEvent } from './messages/incoming/room/furniture/wall/FurnitureWallAddEvent';
import { FurnitureWallEvent } from './messages/incoming/room/furniture/wall/FurnitureWallEvent';
import { FurnitureWallRemoveEvent } from './messages/incoming/room/furniture/wall/FurnitureWallRemoveEvent';
import { FurnitureWallUpdateEvent } from './messages/incoming/room/furniture/wall/FurnitureWallUpdateEvent';
import { RoomDoorEvent } from './messages/incoming/room/mapping/RoomDoorEvent';
import { RoomHeightMapEvent } from './messages/incoming/room/mapping/RoomHeightMapEvent';
import { RoomModelEvent } from './messages/incoming/room/mapping/RoomModelEvent';
import { RoomModelNameEvent } from './messages/incoming/room/mapping/RoomModelNameEvent';
import { RoomStackHeightEvent } from './messages/incoming/room/mapping/RoomStackHeightEvent';
import { RoomThicknessEvent } from './messages/incoming/room/mapping/RoomThicknessEvent';
import { AuthenticatedEvent } from './messages/incoming/security/AuthenticatedEvent';
import { UserPerksEvent } from './messages/incoming/user/access/UserPerksEvent';
import { UserPermissionsEvent } from './messages/incoming/user/access/UserPermissionsEvent';
import { UserRightsEvent } from './messages/incoming/user/access/UserRightsEvent';
import { UserInfoEvent } from './messages/incoming/user/data/UserInfoEvent';
import { ClientPongComposer } from './messages/outgoing/client/ClientPongComposer';
import { ClientReleaseVersionComposer } from './messages/outgoing/client/ClientReleaseVersionComposer';
import { DesktopViewComposer } from './messages/outgoing/desktop/DesktopViewComposer';
import { OutgoingHeader } from './messages/outgoing/OutgoingHeader';
import { RoomEnterComposer } from './messages/outgoing/room/access/RoomEnterComposer';
import { RoomInfoComposer } from './messages/outgoing/room/data/RoomInfoComposer';
import { RoomModel2Composer } from './messages/outgoing/room/mapping/RoomModel2Composer';
import { RoomModelComposer } from './messages/outgoing/room/mapping/RoomModelComposer';
import { SecurityTicketComposer } from './messages/outgoing/security/SecurityTicketComposer';
import { UserInfoComposer } from './messages/outgoing/user/data/UserInfoComposer';

export class NitroMessages implements IMessageConfiguration
{
    private _events: Map<number, Function>;
    private _composers: Map<number, Function>;

    constructor()
    {
        this._events    = new Map();
        this._composers = new Map();

        this.registerEvents();
        this.registerComposers();
    }
    
    private registerEvents(): void
    {
        // CLIENT
        this._events.set(IncomingHeader.CLIENT_PING, ClientPingEvent);

        // DESKTOP
        this._events.set(IncomingHeader.DESKTOP_VIEW, DesktopViewEvent);

        // ROOM

            // ACCESS
            this._events.set(IncomingHeader.ROOM_ENTER, RoomEnterEvent);
            this._events.set(IncomingHeader.ROOM_FORWARD, RoomFowardEvent);

            // DATA
            this._events.set(IncomingHeader.ROOM_SETTINGS_CHAT, RoomChatSettingsEvent);
            this._events.set(IncomingHeader.ROOM_INFO, RoomInfoEvent);
            this._events.set(IncomingHeader.ROOM_INFO_OWNER, RoomInfoOwnerEvent);
            this._events.set(IncomingHeader.ROOM_SCORE, RoomScoreEvent);
            this._events.set(IncomingHeader.ROOM_SETTINGS_SAVE_ERROR, RoomSettingsErrorEvent);
            this._events.set(IncomingHeader.ROOM_SETTINGS, RoomSettingsEvent);
            this._events.set(IncomingHeader.ROOM_SETTINGS_SAVE, RoomSettingsSavedEvent);
            this._events.set(IncomingHeader.ROOM_SETTINGS_UPDATED, RoomSettingsUpdatedEvent);

            // FURNITURE
            this._events.set(IncomingHeader.FURNITURE_DATA, FurnitureDataEvent);
            this._events.set(IncomingHeader.FURNITURE_STATE, FurnitureStateEvent);

                // FLOOR
                this._events.set(IncomingHeader.FURNITURE_FLOOR_ADD, FurnitureFloorAddEvent);
                this._events.set(IncomingHeader.FURNITURE_FLOOR, FurnitureFloorEvent);
                this._events.set(IncomingHeader.FURNITURE_FLOOR_REMOVE, FurnitureFloorRemoveEvent);
                this._events.set(IncomingHeader.FURNITURE_FLOOR_UPDATE, FurnitureFloorUpdateEvent);

                // WALL
                this._events.set(IncomingHeader.ITEM_WALL_ADD, FurnitureWallAddEvent);
                this._events.set(IncomingHeader.ITEM_WALL, FurnitureWallEvent);
                this._events.set(IncomingHeader.ITEM_WALL_REMOVE, FurnitureWallRemoveEvent);
                this._events.set(IncomingHeader.ITEM_WALL_UPDATE, FurnitureWallUpdateEvent);

            // MAPPING
            this._events.set(IncomingHeader.ROOM_MODEL_DOOR, RoomDoorEvent);
            this._events.set(IncomingHeader.ROOM_HEIGHT_MAP, RoomHeightMapEvent);
            this._events.set(IncomingHeader.ROOM_MODEL, RoomModelEvent);
            this._events.set(IncomingHeader.ROOM_MODEL_NAME, RoomModelNameEvent);
            this._events.set(IncomingHeader.ROOM_STACK_HEIGHT, RoomStackHeightEvent);
            this._events.set(IncomingHeader.ROOM_THICKNESS, RoomThicknessEvent);

        // SECURITY
        this._events.set(IncomingHeader.AUTHENTICATED, AuthenticatedEvent);

        // USER

            // ACCESS
            this._events.set(IncomingHeader.USER_PERKS, UserPerksEvent);
            this._events.set(IncomingHeader.USER_PERMISSIONS, UserPermissionsEvent);
            this._events.set(IncomingHeader.USER_RIGHTS, UserRightsEvent);

            // DATA
            this._events.set(IncomingHeader.USER_INFO, UserInfoEvent);
    }

    private registerComposers(): void
    {
        // CLIENT
        this._composers.set(OutgoingHeader.CLIENT_PONG, ClientPongComposer);
        this._composers.set(OutgoingHeader.RELEASE_VERSION, ClientReleaseVersionComposer);

        // DESKTOP
        this._composers.set(OutgoingHeader.DESKTOP_VIEW, DesktopViewComposer);

        // ROOM

            // ACCESS
            this._composers.set(OutgoingHeader.ROOM_ENTER, RoomEnterComposer);

            // DATA
            this._composers.set(OutgoingHeader.ROOM_INFO, RoomInfoComposer);

            // MAPPING
            this._composers.set(OutgoingHeader.ROOM_MODEL, RoomModelComposer);
            this._composers.set(OutgoingHeader.ROOM_MODEL2, RoomModel2Composer);
        
        // SECURITY
        this._composers.set(OutgoingHeader.SECURITY_TICKET, SecurityTicketComposer);

        // USER
        this._composers.set(OutgoingHeader.USER_INFO, UserInfoComposer);
    }

    public get events(): Map<number, Function>
    {
        return this._events;
    }

    public get composers(): Map<number, Function>
    {
        return this._composers;
    }
}