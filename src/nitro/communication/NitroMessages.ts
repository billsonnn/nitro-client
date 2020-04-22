import { IMessageConfiguration } from '../../core/communication/messages/IMessageConfiguration';
import { ClientPingEvent } from './messages/incoming/client/ClientPingEvent';
import { DesktopViewEvent } from './messages/incoming/desktop/DesktopViewEvent';
import { IncomingHeader } from './messages/incoming/IncomingHeader';
import { RoomRightsClearEvent } from './messages/incoming/room/access/rights/RoomRightsClearEvent';
import { RoomRightsEvent } from './messages/incoming/room/access/rights/RoomRightsEvent';
import { RoomRightsOwnerEvent } from './messages/incoming/room/access/rights/RoomRightsOwnerEvent';
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
import { RoomHeightMapUpdateEvent } from './messages/incoming/room/mapping/RoomHeightMapUpdateEvent';
import { RoomModelEvent } from './messages/incoming/room/mapping/RoomModelEvent';
import { RoomModelNameEvent } from './messages/incoming/room/mapping/RoomModelNameEvent';
import { RoomPaintEvent } from './messages/incoming/room/mapping/RoomPaintEvent';
import { RoomThicknessEvent } from './messages/incoming/room/mapping/RoomThicknessEvent';
import { RoomRollingEvent } from './messages/incoming/room/RoomRollingEvent';
import { RoomUnitChatEvent } from './messages/incoming/room/unit/chat/RoomUnitChatEvent';
import { RoomUnitChatShoutEvent } from './messages/incoming/room/unit/chat/RoomUnitChatShoutEvent';
import { RoomUnitChatWhisperEvent } from './messages/incoming/room/unit/chat/RoomUnitChatWhisperEvent';
import { RoomUnitTypingEvent } from './messages/incoming/room/unit/chat/RoomUnitTypingEvent';
import { RoomUnitDanceEvent } from './messages/incoming/room/unit/RoomUnitDanceEvent';
import { RoomUnitEffectEvent } from './messages/incoming/room/unit/RoomUnitEffectEvent';
import { RoomUnitEvent } from './messages/incoming/room/unit/RoomUnitEvent';
import { RoomUnitExpressionEvent } from './messages/incoming/room/unit/RoomUnitExpressionEvent';
import { RoomUnitHandItemEvent } from './messages/incoming/room/unit/RoomUnitHandItemEvent';
import { RoomUnitIdleEvent } from './messages/incoming/room/unit/RoomUnitIdleEvent';
import { RoomUnitInfoEvent } from './messages/incoming/room/unit/RoomUnitInfoEvent';
import { RoomUnitRemoveEvent } from './messages/incoming/room/unit/RoomUnitRemoveEvent';
import { RoomUnitStatusEvent } from './messages/incoming/room/unit/RoomUnitStatusEvent';
import { AuthenticatedEvent } from './messages/incoming/security/AuthenticatedEvent';
import { UserPerksEvent } from './messages/incoming/user/access/UserPerksEvent';
import { UserPermissionsEvent } from './messages/incoming/user/access/UserPermissionsEvent';
import { UserRightsEvent } from './messages/incoming/user/access/UserRightsEvent';
import { UserFigureEvent } from './messages/incoming/user/data/UserFigureEvent';
import { UserInfoEvent } from './messages/incoming/user/data/UserInfoEvent';
import { UserCreditsEvent } from './messages/incoming/user/inventory/currency/UserCreditsEvent';
import { UserCurrencyEvent } from './messages/incoming/user/inventory/currency/UserCurrencyEvent';
import { UserSubscriptionEvent } from './messages/incoming/user/inventory/subscription/UserSubscriptionEvent';
import { ClientPongComposer } from './messages/outgoing/client/ClientPongComposer';
import { ClientReleaseVersionComposer } from './messages/outgoing/client/ClientReleaseVersionComposer';
import { DesktopViewComposer } from './messages/outgoing/desktop/DesktopViewComposer';
import { OutgoingHeader } from './messages/outgoing/OutgoingHeader';
import { RoomEnterComposer } from './messages/outgoing/room/access/RoomEnterComposer';
import { RoomInfoComposer } from './messages/outgoing/room/data/RoomInfoComposer';
import { FurnitureFloorUpdateComposer } from './messages/outgoing/room/furniture/floor/FurnitureFloorUpdateComposer';
import { FurniturePickupComposer } from './messages/outgoing/room/furniture/FurniturePickupComposer';
import { ItemPlaceComposer } from './messages/outgoing/room/furniture/ItemPlaceComposer';
import { FurnitureColorWheelComposer } from './messages/outgoing/room/furniture/logic/FurnitureColorWheelComposer';
import { FurnitureDiceActivateComposer } from './messages/outgoing/room/furniture/logic/FurnitureDiceActivateComposer';
import { FurnitureDiceDeactivateComposer } from './messages/outgoing/room/furniture/logic/FurnitureDiceDeactivateComposer';
import { FurnitureMultiStateComposer } from './messages/outgoing/room/furniture/logic/FurnitureMultiStateComposer';
import { FurnitureRandomStateComposer } from './messages/outgoing/room/furniture/logic/FurnitureRandomStateComposer';
import { FurnitureWallMultiStateComposer } from './messages/outgoing/room/furniture/logic/FurnitureWallMultiStateComposer';
import { FurnitureWallUpdateComposer } from './messages/outgoing/room/furniture/wall/FurnitureWallUpdateComposer';
import { RoomModel2Composer } from './messages/outgoing/room/mapping/RoomModel2Composer';
import { RoomModelComposer } from './messages/outgoing/room/mapping/RoomModelComposer';
import { RoomUnitChatComposer } from './messages/outgoing/room/unit/chat/RoomUnitChatComposer';
import { RoomUnitChatShoutComposer } from './messages/outgoing/room/unit/chat/RoomUnitChatShoutComposer';
import { RoomUnitChatWhisperComposer } from './messages/outgoing/room/unit/chat/RoomUnitChatWhisperComposer';
import { RoomUnitTypingStartComposer } from './messages/outgoing/room/unit/chat/RoomUnitTypingStartComposer';
import { RoomUnitTypingStopComposer } from './messages/outgoing/room/unit/chat/RoomUnitTypingStopComposer';
import { RoomUnitActionComposer } from './messages/outgoing/room/unit/RoomUnitActionComposer';
import { RoomUnitDanceComposer } from './messages/outgoing/room/unit/RoomUnitDanceComposer';
import { RoomUnitLookComposer } from './messages/outgoing/room/unit/RoomUnitLookComposer';
import { RoomUnitSignComposer } from './messages/outgoing/room/unit/RoomUnitSignComposer';
import { RoomUnitSitComposer } from './messages/outgoing/room/unit/RoomUnitSitComposer';
import { RoomUnitWalkComposer } from './messages/outgoing/room/unit/RoomUnitWalkComposer';
import { SecurityTicketComposer } from './messages/outgoing/security/SecurityTicketComposer';
import { UserHomeRoomComposer } from './messages/outgoing/user/data/UserHomeRoomComposer';
import { UserInfoComposer } from './messages/outgoing/user/data/UserInfoComposer';
import { UserCurrencyComposer } from './messages/outgoing/user/inventory/currency/UserCurrencyComposer';
import { UserSubscriptionComposer } from './messages/outgoing/user/inventory/subscription/UserSubscriptionComposer';

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
        this._events.set(IncomingHeader.ROOM_ROLLING, RoomRollingEvent);

            // ACCESS
            this._events.set(IncomingHeader.ROOM_ENTER, RoomEnterEvent);
            this._events.set(IncomingHeader.ROOM_FORWARD, RoomFowardEvent);

            // RIGHTS
            this._events.set(IncomingHeader.ROOM_RIGHTS_CLEAR, RoomRightsClearEvent);
            this._events.set(IncomingHeader.ROOM_RIGHTS_OWNER, RoomRightsOwnerEvent);
            this._events.set(IncomingHeader.ROOM_RIGHTS, RoomRightsEvent);

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
            this._events.set(IncomingHeader.ROOM_HEIGHT_MAP_UPDATE, RoomHeightMapUpdateEvent);
            this._events.set(IncomingHeader.ROOM_MODEL, RoomModelEvent);
            this._events.set(IncomingHeader.ROOM_MODEL_NAME, RoomModelNameEvent);
            this._events.set(IncomingHeader.ROOM_PAINT, RoomPaintEvent);
            this._events.set(IncomingHeader.ROOM_THICKNESS, RoomThicknessEvent);

            // UNIT
            this._events.set(IncomingHeader.UNIT_DANCE, RoomUnitDanceEvent);
            this._events.set(IncomingHeader.UNIT_EFFECT, RoomUnitEffectEvent);
            this._events.set(IncomingHeader.UNIT, RoomUnitEvent);
            this._events.set(IncomingHeader.UNIT_EXPRESSION, RoomUnitExpressionEvent);
            this._events.set(IncomingHeader.UNIT_HAND_ITEM, RoomUnitHandItemEvent);
            this._events.set(IncomingHeader.UNIT_IDLE, RoomUnitIdleEvent);
            this._events.set(IncomingHeader.UNIT_INFO, RoomUnitInfoEvent);
            this._events.set(IncomingHeader.UNIT_REMOVE, RoomUnitRemoveEvent);
            this._events.set(IncomingHeader.UNIT_STATUS, RoomUnitStatusEvent);

                // CHAT
                this._events.set(IncomingHeader.UNIT_CHAT, RoomUnitChatEvent);
                this._events.set(IncomingHeader.UNIT_CHAT_SHOUT, RoomUnitChatShoutEvent);
                this._events.set(IncomingHeader.UNIT_CHAT_WHISPER, RoomUnitChatWhisperEvent);
                this._events.set(IncomingHeader.UNIT_TYPING, RoomUnitTypingEvent);

        // SECURITY
        this._events.set(IncomingHeader.AUTHENTICATED, AuthenticatedEvent);

        // USER

            // ACCESS
            this._events.set(IncomingHeader.USER_PERKS, UserPerksEvent);
            this._events.set(IncomingHeader.USER_PERMISSIONS, UserPermissionsEvent);
            this._events.set(IncomingHeader.USER_RIGHTS, UserRightsEvent);

            // DATA
            this._events.set(IncomingHeader.USER_FIGURE, UserFigureEvent);
            this._events.set(IncomingHeader.USER_INFO, UserInfoEvent);

            // INVENTORY

                // CURRENCY
                this._events.set(IncomingHeader.USER_CREDITS, UserCreditsEvent);
                this._events.set(IncomingHeader.USER_CURRENCY, UserCurrencyEvent);

                // SUBSCRIPTION
                this._events.set(IncomingHeader.USER_SUBSCRIPTION, UserSubscriptionEvent);
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

            // FURNITURE
            this._composers.set(OutgoingHeader.FURNITURE_PICKUP, FurniturePickupComposer);
            this._composers.set(OutgoingHeader.FURNITURE_PLACE, ItemPlaceComposer);

                // FLOOR
                this._composers.set(OutgoingHeader.FURNITURE_FLOOR_UPDATE, FurnitureFloorUpdateComposer);

                // WALL
                this._composers.set(OutgoingHeader.FURNITURE_WALL_UPDATE, FurnitureWallUpdateComposer);

                // LOGIC
                this._composers.set(OutgoingHeader.ITEM_COLOR_WHEEL_CLICK, FurnitureColorWheelComposer);
                this._composers.set(OutgoingHeader.ITEM_DICE_CLICK, FurnitureDiceActivateComposer);
                this._composers.set(OutgoingHeader.ITEM_DICE_CLOSE, FurnitureDiceDeactivateComposer);
                this._composers.set(OutgoingHeader.FURNITURE_MULTISTATE, FurnitureMultiStateComposer);
                this._composers.set(OutgoingHeader.FURNITURE_RANDOMSTATE, FurnitureRandomStateComposer);
                this._composers.set(OutgoingHeader.FURNITURE_WALL_MULTISTATE, FurnitureWallMultiStateComposer);

            // MAPPING
            this._composers.set(OutgoingHeader.ROOM_MODEL, RoomModelComposer);
            this._composers.set(OutgoingHeader.ROOM_MODEL2, RoomModel2Composer);

            // UNIT
            this._composers.set(OutgoingHeader.UNIT_ACTION, RoomUnitActionComposer);
            this._composers.set(OutgoingHeader.UNIT_DANCE, RoomUnitDanceComposer);
            this._composers.set(OutgoingHeader.UNIT_LOOK, RoomUnitLookComposer);
            this._composers.set(OutgoingHeader.UNIT_SIGN, RoomUnitSignComposer);
            this._composers.set(OutgoingHeader.UNIT_SIT, RoomUnitSitComposer);
            this._composers.set(OutgoingHeader.UNIT_WALK, RoomUnitWalkComposer);

                // CHAT
                this._composers.set(OutgoingHeader.UNIT_CHAT, RoomUnitChatComposer);
                this._composers.set(OutgoingHeader.UNIT_CHAT_SHOUT, RoomUnitChatShoutComposer);
                this._composers.set(OutgoingHeader.UNIT_CHAT_WHISPER, RoomUnitChatWhisperComposer);
                this._composers.set(OutgoingHeader.UNIT_TYPING, RoomUnitTypingStartComposer);
                this._composers.set(OutgoingHeader.UNIT_TYPING_STOP, RoomUnitTypingStopComposer);
                
        // SECURITY
        this._composers.set(OutgoingHeader.SECURITY_TICKET, SecurityTicketComposer);

        // USER
        this._composers.set(OutgoingHeader.USER_HOME_ROOM, UserHomeRoomComposer);
        this._composers.set(OutgoingHeader.USER_INFO, UserInfoComposer);

            // INVENTORY

                // CURRENCY
                this._composers.set(OutgoingHeader.USER_CURRENCY, UserCurrencyComposer);

                // SUBSCRIPTION
                this._composers.set(OutgoingHeader.USER_SUBSCRIPTION, UserSubscriptionComposer);
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