import { NitroEvent } from '../../../core/events/NitroEvent';
import { RoomObjectCategory } from '../../room/object/RoomObjectCategory';
import { RoomObjectType } from '../../room/object/RoomObjectType';
import { RoomObjectVariable } from '../../room/object/RoomObjectVariable';
import { RoomControllerLevel } from '../../session/enum/RoomControllerLevel';
import { RoomTradingLevelEnum } from '../../session/enum/RoomTradingLevelEnum';
import { RoomSessionUserBadgesEvent } from '../../session/events/RoomSessionUserBadgesEvent';
import { IFurnitureData } from '../../session/furniture/IFurnitureData';
import { RoomUserData } from '../../session/RoomUserData';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../widget/enums/RoomWidgetEnum';
import { RoomObjectNameEvent } from '../widget/events/RoomObjectNameEvent';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetUpdateInfostandUserEvent } from '../widget/events/RoomWidgetUpdateInfostandUserEvent';
import { InfoStandWidget } from '../widget/infostand/InfoStandWidget';
import { RoomWidgetFurniActionMessage } from '../widget/messages/RoomWidgetFurniActionMessage';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';
import { RoomWidgetRoomObjectMessage } from '../widget/messages/RoomWidgetRoomObjectMessage';
import { RoomWidgetUserActionMessage } from '../widget/messages/RoomWidgetUserActionMessage';

export class InfoStandWidgetHandler implements IRoomWidgetHandler
{
    private static ACTIVITY_POINTS_DISPLAY_ENABLED: boolean = true;

    private _container: IRoomWidgetHandlerContainer;
    private _widget: InfoStandWidget;

    private _disposed: boolean;

    constructor()
    {
        this._container = null;
        this._widget    = null;

        this._disposed  = false;
    }

    public dispose(): void
    {
        if(this.disposed) return;
        
        this._disposed  = true;
        this.container  = null;
    }

    public update(): void
    {
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message || !this._container) return null;

        let userId                  = 0;
        let userData: RoomUserData  = null;

        if(message instanceof RoomWidgetUserActionMessage)
        {
            userId = message.userId;

            const petMessages = [
                RoomWidgetUserActionMessage.RWUAM_REQUEST_PET_UPDATE,
                RoomWidgetUserActionMessage._Str_6480,
                RoomWidgetUserActionMessage.RWUAM_PICKUP_PET,
                RoomWidgetUserActionMessage.RWUAM_MOUNT_PET,
                RoomWidgetUserActionMessage.RWUAM_TOGGLE_PET_RIDING_PERMISSION,
                RoomWidgetUserActionMessage.RWUAM_TOGGLE_PET_BREEDING_PERMISSION,
                RoomWidgetUserActionMessage.RWUAM_DISMOUNT_PET,
                RoomWidgetUserActionMessage.RWUAM_SADDLE_OFF,
                RoomWidgetUserActionMessage.RWUAM_GIVE_CARRY_ITEM_TO_PET,
                RoomWidgetUserActionMessage.RWUAM_GIVE_WATER_TO_PET,
                RoomWidgetUserActionMessage.RWUAM_GIVE_LIGHT_TO_PET,
                RoomWidgetUserActionMessage.RWUAM_TREAT_PET
            ];

            if(petMessages.indexOf(message.type) >= 0)
            {
                userData = this._container.roomSession.userDataManager.getPetData(userId);
            }
            else
            {
                userData = this._container.roomSession.userDataManager.getUserData(userId);
            }
            
            if(!userData) return null;
        }

        let objectId        = 0;
        let objectCategory  = 0;

        if(message instanceof RoomWidgetFurniActionMessage)
        {
            objectId        = message.furniId;
            objectCategory  = message.furniCategory;
        }

        switch(message.type)
        {
            case RoomWidgetRoomObjectMessage.GET_OBJECT_INFO:
                return this.processObjectInfoMessage((message as RoomWidgetRoomObjectMessage));
            case RoomWidgetRoomObjectMessage.GET_OBJECT_NAME:
                return this.processObjectNameMessage((message as RoomWidgetRoomObjectMessage));
        }

        return null;
    }

    public processEvent(k: NitroEvent): void
    {
    }

    private processObjectInfoMessage(message: RoomWidgetRoomObjectMessage): RoomWidgetUpdateEvent
    {
        const roomId = this._container.roomSession.roomId;

        switch (message.category)
        {
            case RoomObjectCategory.FLOOR:
            case RoomObjectCategory.WALL:
                //this._Str_23142(message, roomId);
                break;
            case RoomObjectCategory.UNIT:
                if(!this._container.roomSession || !this._container.sessionDataManager || !this._container.events || !this._container.roomEngine) return null;

                const userData = this._container.roomSession.userDataManager.getUserDataByIndex(message.id);

                if(!userData) return null;

                switch (userData.type)
                {
                    case RoomObjectType.PET:
                        //this._Str_25299(userData._Str_2394);
                        break;
                    case RoomObjectType.USER:
                        this._Str_22722(roomId, message.id, message.category, userData);
                        break;
                    case RoomObjectType.BOT:
                        //this._Str_22312(roomId, message.id, message.category, userData);
                        break;
                    case RoomObjectType.RENTABLE_BOT:
                        //this._Str_23115(roomId, message.id, message.category, userData);
                        break;
                }
                break;
        }
        return null;
    }

    private processObjectNameMessage(k: RoomWidgetRoomObjectMessage): RoomWidgetUpdateEvent
    {
        const roomId = this._container.roomSession.roomId;

        let id: number          = 0;
        let name: string        = null;
        let type: number        = 0;
        let roomIndex: number   = 0;

        switch(k.category)
        {
            case RoomObjectCategory.FLOOR:
            case RoomObjectCategory.WALL:
                if(!this._container.events || !this._container.roomEngine) return null;

                const roomObject    = this._container.roomEngine.getRoomObject(roomId, k.id, k.category);
                const objectType    = roomObject.type;

                if(objectType.indexOf('poster') === 0)
                {
                    id          = -1;
                    name        = ('poster_' + parseInt(objectType.replace('poster', '')) + '_name');
                    roomIndex   = roomObject.id;
                }
                else
                {
                    let furniData: IFurnitureData = null;

                    const typeId = (roomObject.model.getValue(RoomObjectVariable.FURNITURE_TYPE_ID) as number);

                    if(k.category === RoomObjectCategory.FLOOR)
                    {
                        furniData = this._container.sessionDataManager.getFloorItemData(typeId);
                    }

                    else if(k.category === RoomObjectCategory.WALL)
                    {
                        furniData = this._container.sessionDataManager.getWallItemData(typeId);
                    }

                    if(!furniData) return null;

                    id          = furniData.id;
                    name        = furniData.name;
                    roomIndex   = roomObject.id;
                }
                break;
            case RoomObjectCategory.UNIT:
                if(!this._container.roomSession || !this._container.roomSession.userDataManager) return null;

                const userData = this._container.roomSession.userDataManager.getUserDataByIndex(k.id);

                if(!userData) return null;

                id          = userData.webID;
                name        = userData.name;
                type        = userData.type;
                roomIndex   = userData.roomIndex;
                break;
        }

        if(name) this._container.events.dispatchEvent(new RoomObjectNameEvent(id, k.category, name, type, roomIndex));

        return null;
    }

    private _Str_22722(roomId: number, roomIndex: number, category: number, _arg_4: RoomUserData): void
    {
        let eventType = RoomWidgetUpdateInfostandUserEvent.OWN_USER;

        if(_arg_4.webID !== this._container.sessionDataManager.userId)
        {
            eventType = RoomWidgetUpdateInfostandUserEvent.PEER;
        }

        const event = new RoomWidgetUpdateInfostandUserEvent(eventType);

        event.isSpectator   = this._container.roomSession.isSpectator;
        event.name          = _arg_4.name;
        event.motto         = _arg_4.custom;

        if(InfoStandWidgetHandler.ACTIVITY_POINTS_DISPLAY_ENABLED)
        {
            event.activityPoints = _arg_4.activityPoints;
        }

        event.webID     = _arg_4.webID;
        event.roomIndex = roomIndex;
        event.userType = RoomObjectType.USER;

        let roomObject = this._container.roomEngine.getRoomObject(roomId, roomIndex, category);

        if(roomObject)
        {
            event.carryId = (roomObject.model.getValue(RoomObjectVariable.FIGURE_CARRY_OBJECT) as number);
        }

        if(eventType == RoomWidgetUpdateInfostandUserEvent.OWN_USER)
        {
            event.realName = this._container.sessionDataManager.realName;
            //event._Str_4330 = this._container.sessionDataManager._Str_11198;
        }

        event.isRoomOwner           = this._container.roomSession.isRoomOwner;
        event.isGuildRoom           = this._container.roomSession.isGuildRoom;
        event.roomControllerLevel   = this._container.roomSession.controllerLevel;
        event.isModerator           = this._container.sessionDataManager.isModerator;
        event.isAmbassador          = this._container.sessionDataManager.isAmbassador;

        if(eventType === RoomWidgetUpdateInfostandUserEvent.PEER)
        {
            //event.canBeAskedForAFriend = this._container.friendList.canBeAskedForAFriend(_arg_4._Str_2394);
            // _local_9 = this._container.friendList.getFriend(_arg_4._Str_2394);
            // if (_local_9 != null)
            // {
            //     event.realName = _local_9.realName;
            //     event.isFriend = true;
            // }

            if(roomObject)
            {
                let flatControl = (roomObject.model.getValue(RoomObjectVariable.FIGURE_FLAT_CONTROL) as number);

                if(flatControl !== null) event.flatControl = flatControl;

                // event._Str_6394 = this._Str_23100(event);
                // event._Str_5990 = this._Str_22729(event);
                // event._Str_6701 = this._Str_23573(event);
                // Logger.log(((((((("Set moderation levels to " + event.name) + "Muted: ") + event._Str_6394) + ", Kicked: ") + event._Str_5990) + ", Banned: ") + event._Str_6701));
            }

            event.isIgnored = this._container.sessionDataManager.isUserIgnored(_arg_4.name);
            //event._Str_3577 = this._container.sessionDataManager._Str_3577;

            const isShuttingDown    = this._container.sessionDataManager.isSystemShutdown;
            const tradeMode         = this._container.roomSession.tradeMode;

            if(isShuttingDown)
            {
                event.canTrade = false;
            }
            else
            {
                switch(tradeMode)
                {
                    case RoomTradingLevelEnum._Str_14475:
                        const _local_15 = ((event.roomControllerLevel !== RoomControllerLevel.NONE) && (event.roomControllerLevel !== RoomControllerLevel.GUILD_MEMBER));
                        const _local_16 = ((event.flatControl !== RoomControllerLevel.NONE) && (event.flatControl !== RoomControllerLevel.GUILD_MEMBER));

                        event.canTrade = ((_local_15) || (_local_16));
                        break;
                    case RoomTradingLevelEnum._Str_9173:
                        event.canTrade = true;
                        break;
                    default:
                        event.canTrade = false;
                        break;
                }
            }

            event._Str_6622 = RoomWidgetUpdateInfostandUserEvent._Str_18400;

            if(isShuttingDown) event._Str_6622 = RoomWidgetUpdateInfostandUserEvent._Str_14161;
            
            if(tradeMode !== RoomTradingLevelEnum._Str_9173) event._Str_6622 = RoomWidgetUpdateInfostandUserEvent._Str_13798;

            // const _local_12 = this._container.sessionDataManager.userId;
            // _local_13 = this._container.sessionDataManager._Str_18437(_local_12);
            // this._Str_16287(_local_12, _local_13);
        }

        event.groupId = parseInt(_arg_4.guildId);
        //event._Str_5235 = this._container.sessionDataManager._Str_17173(int(_arg_4._Str_4592));
        event.groupName = _arg_4.groupName;
        //event.badges = this._container.roomSession.userDataManager._Str_21323(_arg_4.webID);
        event.figure = _arg_4.figure;
        this._container.events.dispatchEvent(event);
        //var _local_8:Array = this._container.sessionDataManager._Str_18437(_arg_4.webID);
        //this._Str_16287(_arg_4._Str_2394, _local_8);
        //this._container._Str_8097._Str_14387(_arg_4.webID);
        //this._container.connection.send(new _Str_8049(_arg_4._Str_2394));
    }

    public get type(): string
    {
        return RoomWidgetEnum.INFOSTAND;
    }

    public get messageTypes(): string[]
    {
        let types: string[] = [];

        types.push(RoomWidgetRoomObjectMessage.GET_OBJECT_INFO);
        types.push(RoomWidgetRoomObjectMessage.GET_OBJECT_NAME);

        return types;
    }

    public get eventTypes(): string[]
    {
        return [ RoomSessionUserBadgesEvent.RSUBE_BADGES ];
    }

    public get container(): IRoomWidgetHandlerContainer
    {
        return this._container;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        if(this._container)
        {

        }

        this._container = k;

        if(!k) return;
    }

    public get widget(): InfoStandWidget
    {
        return this._widget;
    }

    public set widget(widget: InfoStandWidget)
    {
        this._widget = widget;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}