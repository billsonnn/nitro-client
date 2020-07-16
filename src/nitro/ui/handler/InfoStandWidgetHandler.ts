import { NitroEvent } from '../../../core/events/NitroEvent';
import { Vector3d } from '../../../room/utils/Vector3d';
import { AvatarScaleType } from '../../avatar/enum/AvatarScaleType';
import { AvatarSetType } from '../../avatar/enum/AvatarSetType';
import { RoomUnitDropHandItemComposer } from '../../communication/messages/outgoing/room/unit/RoomUnitDropHandItemComposer';
import { RoomUnitGiveHandItemComposer } from '../../communication/messages/outgoing/room/unit/RoomUnitGiveHandItemComposer';
import { Nitro } from '../../Nitro';
import { ObjectDataFactory } from '../../room/object/data/ObjectDataFactory';
import { RoomObjectCategory } from '../../room/object/RoomObjectCategory';
import { RoomObjectOperationType } from '../../room/object/RoomObjectOperationType';
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
import { RoomWidgetEnumItemExtradataParameter } from '../widget/enums/RoomWidgetEnumItemExtradataParameter';
import { RoomObjectNameEvent } from '../widget/events/RoomObjectNameEvent';
import { RoomWidgetFurniInfostandUpdateEvent } from '../widget/events/RoomWidgetFurniInfostandUpdateEvent';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetUserInfostandUpdateEvent } from '../widget/events/RoomWidgetUserInfostandUpdateEvent';
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
    private _avatarImageCache: Map<string, HTMLImageElement>;
    private _furniImageCache: Map<string, HTMLImageElement>;

    private _disposed: boolean;

    constructor()
    {
        this._container         = null;
        this._widget            = null;
        this._avatarImageCache  = new Map();

        this._disposed  = false;
    }

    public dispose(): void
    {
        if(this.disposed) return;

        this._avatarImageCache = null;
        this.container = null;
        
        this._disposed  = true;
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
            case RoomWidgetUserActionMessage.RWUAM_DROP_CARRY_ITEM:
                this._container.connection.send(new RoomUnitDropHandItemComposer());
                return;
            case RoomWidgetUserActionMessage.RWUAM_PASS_CARRY_ITEM:
                this._container.connection.send(new RoomUnitGiveHandItemComposer(userId));
                return;
            case RoomWidgetFurniActionMessage.RWFAM_MOVE:
                this._container.roomEngine.processRoomObjectOperation(objectId, objectCategory, RoomObjectOperationType.OBJECT_MOVE);
                return;
            case RoomWidgetFurniActionMessage.RWFUAM_ROTATE:
                this._container.roomEngine.processRoomObjectOperation(objectId, objectCategory, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                return;
            case RoomWidgetFurniActionMessage.RWFAM_PICKUP:
                this._container.roomEngine.processRoomObjectOperation(objectId, objectCategory, RoomObjectOperationType.OBJECT_PICKUP);
                return;
            case RoomWidgetFurniActionMessage.RWFAM_USE:
                this._container.roomEngine.useRoomObject(objectId, objectCategory);
                return;
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
                this._Str_23142(message, roomId);
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

    private _Str_23142(k: RoomWidgetRoomObjectMessage, _arg_2: number): void
    {
        if(!this._container || !this._container.events || !this._container.roomEngine) return;

        if(k.id < 0) return;

        const infostandEvent = new RoomWidgetFurniInfostandUpdateEvent(RoomWidgetFurniInfostandUpdateEvent.FURNI);

        infostandEvent.id       = k.id;
        infostandEvent.category = k.category;

        const roomObject = this._container.roomEngine.getRoomObject(_arg_2, k.id, k.category);

        if(!roomObject) return;

        const model = roomObject.model;

        if(model.getValue(RoomWidgetEnumItemExtradataParameter.INFOSTAND_EXTRA_PARAM) as string)
        {
            infostandEvent.extraParam = (model.getValue(RoomWidgetEnumItemExtradataParameter.INFOSTAND_EXTRA_PARAM) as string);
        }

        const dataFormat    = (model.getValue(RoomObjectVariable.FURNITURE_DATA_FORMAT) as number);
        const objectData    = ObjectDataFactory.getData(dataFormat);

        objectData.initializeFromRoomObjectModel(model);

        infostandEvent.stuffData = objectData;

        const objectType = roomObject.type;

        if(objectType.indexOf('poster') === 0)
        {
            let _local_13 = parseInt(objectType.replace('poster', ''));

            infostandEvent.name         = (('${poster_' + _local_13) + '_name}');
            infostandEvent.description  = (('${poster_' + _local_13) + '_desc}');
        }
        else
        {
            const _local_14 = (model.getValue(RoomObjectVariable.FURNITURE_TYPE_ID) as number);

            let furnitureData: IFurnitureData = null;

            if (k.category === RoomObjectCategory.FLOOR)
            {
                furnitureData = this._container.sessionDataManager.getFloorItemData(_local_14);
            }

            else if (k.category == RoomObjectCategory.WALL)
            {
                furnitureData = this._container.sessionDataManager.getWallItemData(_local_14);
            }

            if(furnitureData)
            {
                infostandEvent.name         = furnitureData.name;
                infostandEvent.description  = furnitureData.description;
                infostandEvent.purchaseOfferId    = furnitureData.offerId;
                //infostandEvent.purchaseCouldBeUsedForBuyout    = furnitureData._Str_7629;
                //infostandEvent.rentOfferId    = furnitureData._Str_3693;
                //infostandEvent.rentCouldBeUsedForBuyout    = furnitureData._Str_8116;
                //infostandEvent._Str_6098    = furnitureData._Str_6098;

                // if (((!(this._container._Str_10421 == null)) && (k.category == RoomObjectCategory.FLOOR)))
                // {
                //     this._container._Str_10421._Str_15677(roomObject.getId(), furnitureData._Str_2772);
                // }
            }
        }

        if (objectType.indexOf('post_it') > -1)
        {
            infostandEvent.isStickie = true;
        }

        const expiryTime        = (model.getValue(RoomObjectVariable.FURNITURE_EXPIRY_TIME) as number);
        const expiryTimestamp   = (model.getValue(RoomObjectVariable.FURNITURE_EXPIRTY_TIMESTAMP) as number);

        infostandEvent.expiration = ((expiryTime < 0) ? expiryTime : Math.max(0, (expiryTime - ((Nitro.instance.time - expiryTimestamp) / 1000))));

        let roomObjectImage = this._container.roomEngine.getRoomObjectImage(_arg_2, k.id, k.category, new Vector3d(180), 64, null);
        
        if(!roomObjectImage.data || (roomObjectImage.data.width > 140) || (roomObjectImage.data.height > 200))
        {
            roomObjectImage = this._container.roomEngine.getRoomObjectImage(_arg_2, k.id, k.category, new Vector3d(180), 1, null);
        }

        if(roomObjectImage && roomObjectImage.data)
        {
            const sprite    = PIXI.Sprite.from(roomObjectImage.data);
            const image     = Nitro.instance.renderer.extract.image(sprite);

            if(image) infostandEvent.image = image;
        }
        
        infostandEvent.isWallItem           = (k.category === RoomObjectCategory.WALL);
        infostandEvent.isRoomOwner          = this._container.roomSession.isRoomOwner;
        infostandEvent.roomControllerLevel  = this._container.roomSession.controllerLevel;
        infostandEvent.isAnyRoomOwner       = this._container.sessionDataManager.isModerator;
        infostandEvent.ownerId              = (model.getValue(RoomObjectVariable.FURNITURE_OWNER_ID) as number);
        infostandEvent.ownerName            = (model.getValue(RoomObjectVariable.FURNITURE_OWNER_NAME) as string);
        infostandEvent.usagePolicy          = (model.getValue(RoomObjectVariable.FURNITURE_USAGE_POLICY) as number);

        const guildId = parseInt(model.getValue(RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_GUILD_ID));

        if(guildId !== 0)
        {
            infostandEvent.groupId = guildId;
            //this.container.connection.send(new _Str_2863(guildId, false));
        }

        if(this._container.isOwnerOfFurniture(roomObject))
        {
            infostandEvent.isOwner = true;
        }

        this._container.events.dispatchEvent(infostandEvent);

        // if (((!(infostandEvent._Str_2415 == null)) && (infostandEvent._Str_2415.length > 0)))
        // {
        //     _local_16 = -1;
        //     _local_17 = '';
        //     _local_18 = '';
        //     _local_19 = '';
        //     if (infostandEvent._Str_2415 == RoomWidgetEnumItemExtradataParameter.JUKEBOX)
        //     {
        //         _local_20 = this._musicController._Str_6500();
        //         if (_local_20 != null)
        //         {
        //             _local_16 = _local_20._Str_13794;
        //             _local_19 = RoomWidgetSongUpdateEvent.PLAYING_CHANGED;
        //         }
        //     }
        //     else
        //     {
        //         if (infostandEvent._Str_2415.indexOf(RoomWidgetEnumItemExtradataParameter.SONGDISK) == 0)
        //         {
        //             _local_21 = infostandEvent._Str_2415.substr(RoomWidgetEnumItemExtradataParameter.SONGDISK.length);
        //             _local_16 = parseInt(_local_21);
        //             _local_19 = RoomWidgetSongUpdateEvent.DATA_RECEIVED;
        //         }
        //     }
        //     if (_local_16 != -1)
        //     {
        //         _local_22 = this._musicController._Str_3255(_local_16);
        //         if (_local_22 != null)
        //         {
        //             _local_17 = _local_22.name;
        //             _local_18 = _local_22.creator;
        //         }
        //         this._container.events.dispatchEvent(new RoomWidgetSongUpdateEvent(_local_19, _local_16, _local_17, _local_18));
        //     }
        // }
    }

    private _Str_22722(roomId: number, roomIndex: number, category: number, _arg_4: RoomUserData): void
    {
        let eventType = RoomWidgetUserInfostandUpdateEvent.OWN_USER;

        if(_arg_4.webID !== this._container.sessionDataManager.userId)
        {
            eventType = RoomWidgetUserInfostandUpdateEvent.PEER;
        }

        const event = new RoomWidgetUserInfostandUpdateEvent(eventType);

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

        if(eventType == RoomWidgetUserInfostandUpdateEvent.OWN_USER)
        {
            event.realName = this._container.sessionDataManager.realName;
            //event._Str_4330 = this._container.sessionDataManager._Str_11198;
        }

        event.isRoomOwner           = this._container.roomSession.isRoomOwner;
        event.isGuildRoom           = this._container.roomSession.isGuildRoom;
        event.roomControllerLevel   = this._container.roomSession.controllerLevel;
        event.isModerator           = this._container.sessionDataManager.isModerator;
        event.isAmbassador          = this._container.sessionDataManager.isAmbassador;

        if(eventType === RoomWidgetUserInfostandUpdateEvent.PEER)
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
                // Logger.log(((((((('Set moderation levels to ' + event.name) + 'Muted: ') + event._Str_6394) + ', Kicked: ') + event._Str_5990) + ', Banned: ') + event._Str_6701));
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

            event._Str_6622 = RoomWidgetUserInfostandUpdateEvent._Str_18400;

            if(isShuttingDown) event._Str_6622 = RoomWidgetUserInfostandUpdateEvent._Str_14161;
            
            if(tradeMode !== RoomTradingLevelEnum._Str_9173) event._Str_6622 = RoomWidgetUserInfostandUpdateEvent._Str_13798;

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

    public getUserImage(figure: string): HTMLImageElement
    {
        let existing = this._avatarImageCache.get(figure);

        if(!existing)
        {
            const avatarImage = this._container.avatarRenderManager.createAvatarImage(figure, AvatarScaleType.LARGE, null, null);

            if(avatarImage)
            {
                avatarImage.setDirection(AvatarSetType.FULL, 4);
                
                const image = avatarImage.getCroppedImage(AvatarSetType.FULL, 1);

                if(image) existing = image;

                avatarImage.dispose();
            }

            if(existing) this._avatarImageCache.set(figure, existing);
        }

        return existing;
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
        types.push(RoomWidgetUserActionMessage.RWUAM_DROP_CARRY_ITEM);
        types.push(RoomWidgetUserActionMessage.RWUAM_PASS_CARRY_ITEM);
        types.push(RoomWidgetFurniActionMessage.RWFAM_MOVE);
        types.push(RoomWidgetFurniActionMessage.RWFUAM_ROTATE);
        types.push(RoomWidgetFurniActionMessage.RWFAM_PICKUP);
        types.push(RoomWidgetFurniActionMessage.RWFAM_USE);

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