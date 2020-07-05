import { NitroEvent } from '../../../core/events/NitroEvent';
import { IRoomObject } from '../../../room/object/IRoomObject';
import { IRoomEngine } from '../../room/IRoomEngine';
import { RoomObjectCategory } from '../../room/object/RoomObjectCategory';
import { RoomObjectType } from '../../room/object/RoomObjectType';
import { RoomObjectVariable } from '../../room/object/RoomObjectVariable';
import { RoomSessionDanceEvent } from '../../session/events/RoomSessionDanceEvent';
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
import { RoomWidgetAvatarExpressionMessage } from '../widget/messages/RoomWidgetAvatarExpressionMessage';
import { RoomWidgetChangePostureMessage } from '../widget/messages/RoomWidgetChangePostureMessage';
import { RoomWidgetDanceMessage } from '../widget/messages/RoomWidgetDanceMessage';
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
            case RoomWidgetDanceMessage.RWCM_MESSAGE_DANCE:
                const danceMessage = (message as RoomWidgetDanceMessage);

                if(this._container && this._container.roomSession)
                {
                    this._container.roomSession.sendDanceMessage(danceMessage.style);
                }
                break;
            case RoomWidgetAvatarExpressionMessage.RWCM_MESSAGE_AVATAR_EXPRESSION:
                const expressionMessage = (message as RoomWidgetAvatarExpressionMessage);

                if(this._container && this._container.roomSession)
                {
                    this._container.roomSession.sendExpressionMessage(expressionMessage.animation._Str_6677)
                }
                break;
            case RoomWidgetChangePostureMessage.RWCPM_MESSAGE_CHANGE_POSTURE:
                const postureMessage = (message as RoomWidgetChangePostureMessage);

                if(this._container && this._container.roomSession)
                {
                    this._container.roomSession.sendPostureMessage(postureMessage.posture);
                }
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
            case RoomSessionDanceEvent.RSDE_DANCE:
                const danceEvent = (event as RoomSessionDanceEvent);

                if(this._widget && this._container && this._container.roomSession && this._container.roomSession.userDataManager)
                {
                    const userData = this._container.roomSession.userDataManager.getUserData(this._container.sessionDataManager.userId);

                    if(userData && (userData.roomIndex === danceEvent.roomIndex))
                    {
                        this._widget.isDancing = (danceEvent.danceId !== 0);
                    }
                }
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
            const object    = this._container.roomEngine.getRoomObjectByIndex(roomId, i, RoomObjectCategory.UNIT);
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
        return [
            RoomWidgetRoomObjectMessage.GET_OWN_CHARACTER_INFO,
            RoomWidgetDanceMessage.RWCM_MESSAGE_DANCE,
            RoomWidgetAvatarExpressionMessage.RWCM_MESSAGE_AVATAR_EXPRESSION,
            RoomWidgetChangePostureMessage.RWCPM_MESSAGE_CHANGE_POSTURE
        ];
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionUserDataUpdateEvent.USER_DATA_UPDATED,
            RoomSessionDanceEvent.RSDE_DANCE
        ];
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