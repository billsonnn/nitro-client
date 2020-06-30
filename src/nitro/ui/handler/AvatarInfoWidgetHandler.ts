import { NitroEvent } from '../../../core/events/NitroEvent';
import { IRoomObject } from '../../../room/object/IRoomObject';
import { IRoomEngine } from '../../room/IRoomEngine';
import { RoomObjectCategory } from '../../room/object/RoomObjectCategory';
import { RoomObjectType } from '../../room/object/RoomObjectType';
import { RoomObjectVariable } from '../../room/object/RoomObjectVariable';
import { RoomSessionUserDataUpdateEvent } from '../../session/events/RoomSessionUserDataUpdateEvent';
import { IFurnitureData } from '../../session/furniture/IFurnitureData';
import { IRoomSession } from '../../session/IRoomSession';
import { RoomUserData } from '../../session/RoomUserData';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { AvatarInfoWidget } from '../widget/avatarinfo/AvatarInfoWidget';
import { RoomWidgetEnum } from '../widget/enums/RoomWidgetEnum';
import { RoomWidgetAvatarInfoEvent } from '../widget/events/RoomWidgetAvatarInfoEvent';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetUserDataUpdateEvent } from '../widget/events/RoomWidgetUserDataUpdateEvent';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';
import { RoomWidgetRoomObjectMessage } from '../widget/messages/RoomWidgetRoomObjectMessage';
import { RoomWidgetUserActionMessage } from '../widget/messages/RoomWidgetUserActionMessage';

export class AvatarInfoWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetHandlerContainer = null;
    private _widget: AvatarInfoWidget;

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
        
        this.container  = null;
        this._widget    = null;
        this._disposed  = true;
    }

    public update(): void
    {
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message) return;

        let userId = 0;

        if(message instanceof RoomWidgetUserActionMessage) userId = message.userId;

        switch (message.type)
        {
            case RoomWidgetRoomObjectMessage.GET_OWN_CHARACTER_INFO:
                this.getOwnCharacterInfo();
                break;
        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event) return;

        switch (event.type)
        {
            case RoomSessionUserDataUpdateEvent.USER_DATA_UPDATED:
                this._container.events.dispatchEvent(new RoomWidgetUserDataUpdateEvent());
                return;
        }
    }

    private getOwnCharacterInfo(): void
    {
        let userId      = this._container.sessionDataManager.userId;
        let userName    = this._container.sessionDataManager.userName;
        //let _local_3: boolean = this._container.sessionDataManager._Str_11198;
        let _local_3    = false;
        let _local_4    = this._container.roomSession.userDataManager.getUserData(userId);

        if(_local_4) this._container.events.dispatchEvent(new RoomWidgetAvatarInfoEvent(userId, userName, _local_4.type, _local_4.roomIndex, _local_3));
    }

    public getObjectFurnitureData(k: IRoomObject): IFurnitureData
    {
        if(!k) return null;

        const typeId        = (k.model.getValue(RoomObjectVariable.FURNITURE_TYPE_ID) as number);
        const furnitureData = this._container.sessionDataManager.getFloorItemData(typeId);

        return furnitureData;
    }

    private getPetUserData(k: number): RoomUserData
    {
        const roomId        = this._container.roomSession.roomId;
        const totalObjects  = this._container.roomEngine.getTotalObjectsForManager(roomId, RoomObjectCategory.UNIT);

        let i = 0;

        while(i < totalObjects)
        {
            const object    = this._container.roomEngine.getRoomObject(roomId, i, RoomObjectCategory.UNIT);
            const userData  = this._container.roomSession.userDataManager.getUserDataByIndex(object.id);

            if(userData && (userData.type === RoomObjectType.PET) && (userData.webID === k)) return userData;

            i++;
        }

        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.AVATAR_INFO;
    }

    public get messageTypes(): string[]
    {
        return [ RoomWidgetRoomObjectMessage.GET_OWN_CHARACTER_INFO ];
    }

    public get eventTypes(): string[]
    {
        return [ RoomSessionUserDataUpdateEvent.USER_DATA_UPDATED ];
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

    public get widget(): AvatarInfoWidget
    {
        return this._widget;
    }

    public set widget(k: AvatarInfoWidget)
    {
        this._widget = k;
    }

    public get roomEngine(): IRoomEngine
    {
        return ((this._container && this._container.roomEngine) || null);
    }

    public get roomSession(): IRoomSession
    {
        return ((this._container && this._container.roomSession) || null);
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}