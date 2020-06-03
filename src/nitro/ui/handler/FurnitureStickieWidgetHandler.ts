import { NitroEvent } from '../../../core/events/NitroEvent';
import { RoomObjectVariable } from '../../room/object/RoomObjectVariable';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetFurniToWidgetMessage } from '../widget/messages/RoomWidgetFurniToWidgetMessage';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';
import { RoomWidgetStickieSendUpdateMessage } from '../widget/messages/RoomWidgetStickieSendUpdateMessage';

export class FurnitureStickieWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetHandlerContainer;
    private _disposed: boolean;

    constructor()
    {
        this._container = null;
        this._disposed  = false;
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._container = null;
        this._disposed  = true;
    }

    public update(): void
    {

    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message || this.disposed) return null;

        switch(message.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_STICKIE:
                const widgetMessage = message as RoomWidgetFurniToWidgetMessage;
                const roomObject    = this._container.roomEngine.getRoomObject(widgetMessage.roomId, widgetMessage.objectId, widgetMessage.category);

                if(roomObject && roomObject.model)
                {
                    let data = roomObject.model.getValue(RoomObjectVariable.FURNITURE_ITEMDATA) as string;

                    if(data.length < 6) return null;
                }
                break;
        }
        
        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || this._disposed) return;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FURNI_STICKIE_WIDGET;
    }

    public get messageTypes(): string[]
    {
        return [ RoomWidgetFurniToWidgetMessage.REQUEST_STICKIE, RoomWidgetStickieSendUpdateMessage.SEND_DELETE, RoomWidgetStickieSendUpdateMessage.SEND_UPDATE ];
    }

    public get eventTypes(): string[]
    {
        return [ ];
    }

    public get container(): IRoomWidgetHandlerContainer
    {
        return this._container;
    }

    public set container(container: IRoomWidgetHandlerContainer)
    {
        this._container = container;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}