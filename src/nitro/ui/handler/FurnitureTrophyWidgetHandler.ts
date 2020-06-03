import { NitroEvent } from '../../../core/events/NitroEvent';
import { RoomObjectVariable } from '../../room/object/RoomObjectVariable';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../widget/enums/RoomWidgetEnum';
import { RoomWidgetTrophyUpdateEvent } from '../widget/events/RoomWidgetTrophyUpdateEvent';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetFurniToWidgetMessage } from '../widget/messages/RoomWidgetFurniToWidgetMessage';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';

export class FurnitureTrophyWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetHandlerContainer;
    private _disposed: boolean;

    constructor()
    {
        this._container     = null;
        this._disposed    = false;
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
            case RoomWidgetFurniToWidgetMessage.REQUEST_TROPHY:
                const widgetMessage = message as RoomWidgetFurniToWidgetMessage;
                const roomObject    = this._container.roomEngine.getRoomObject(widgetMessage.roomId, widgetMessage.objectId, widgetMessage.category);

                if(roomObject && roomObject.model)
                {
                    let data = roomObject.model.getValue(RoomObjectVariable.FURNITURE_DATA) as string;

                    const color = roomObject.model.getValue(RoomObjectVariable.FURNITURE_COLOR) as number;
                    const extra = parseInt(roomObject.model.getValue(RoomObjectVariable.FURNITURE_EXTRAS));

                    const name = data.substring(0, data.indexOf('\t'));

                    data = data.substring((name.length + 1), data.length);

                    const date      = data.substring(0, data.indexOf('\t'));
                    const message   = data.substring((date.length + 1), data.length);

                    this._container.events.dispatchEvent(new RoomWidgetTrophyUpdateEvent(RoomWidgetTrophyUpdateEvent.TROPHY_DATA, name, date, message, color, extra));
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
        return RoomWidgetEnum.FURNI_TROPHY_WIDGET;
    }

    public get messageTypes(): string[]
    {
        return [ RoomWidgetFurniToWidgetMessage.REQUEST_TROPHY ];
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