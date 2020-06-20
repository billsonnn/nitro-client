import { NitroEvent } from '../../../core/events/NitroEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { RoomWidgetShowPlaceholderEvent } from '../widget/events/RoomWidgetShowPlaceholderEvent';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetFurniToWidgetMessage } from '../widget/messages/RoomWidgetFurniToWidgetMessage';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';

export class PlaceholderWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetHandlerContainer = null;

    public dispose(): void
    {
        this._container = null;
    }

    public get disposed(): boolean
    {
        return false;
    }

    public get type(): string
    {
        return null;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [ RoomWidgetFurniToWidgetMessage.REQUEST_PLACEHOLDER ];
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        this._container.events.dispatchEvent(new RoomWidgetShowPlaceholderEvent(RoomWidgetShowPlaceholderEvent.RWSPE_SHOW_PLACEHOLDER));

        return null;
    }

    public get eventTypes(): string[]
    {
        return null;
    }

    public processEvent(k: NitroEvent): void
    {
    }

    public update(): void
    {
    }
}