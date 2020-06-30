import { NitroEvent } from '../../../core/events/NitroEvent';
import { RoomObjectCategory } from '../../room/object/RoomObjectCategory';
import { RoomObjectVariable } from '../../room/object/RoomObjectVariable';
import { RoomSessionUserBadgesEvent } from '../../session/events/RoomSessionUserBadgesEvent';
import { IFurnitureData } from '../../session/furniture/IFurnitureData';
import { RoomUserData } from '../../session/RoomUserData';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../widget/enums/RoomWidgetEnum';
import { RoomObjectNameEvent } from '../widget/events/RoomObjectNameEvent';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { InfoStandWidget } from '../widget/infostand/InfoStandWidget';
import { RoomWidgetFurniActionMessage } from '../widget/messages/RoomWidgetFurniActionMessage';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';
import { RoomWidgetRoomObjectMessage } from '../widget/messages/RoomWidgetRoomObjectMessage';
import { RoomWidgetUserActionMessage } from '../widget/messages/RoomWidgetUserActionMessage';

export class InfoStandWidgetHandler implements IRoomWidgetHandler
{
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
            case RoomWidgetRoomObjectMessage.GET_OBJECT_NAME:
                return this.processObjectNameMessage((message as RoomWidgetRoomObjectMessage));
        }

        return null;
    }

    public processEvent(k: NitroEvent): void
    {
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

    public get type(): string
    {
        return RoomWidgetEnum.INFOSTAND;
    }

    public get messageTypes(): string[]
    {
        let k: string[] = [];

        k.push(RoomWidgetRoomObjectMessage.GET_OBJECT_NAME);

        return k;
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