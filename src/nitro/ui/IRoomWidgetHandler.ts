import { IDisposable } from '../../core/common/disposable/IDisposable';
import { IRoomWidgetHandlerContainer } from './IRoomWidgetHandlerContainer';
import { RoomWidgetUpdateEvent } from './widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from './widget/messages/RoomWidgetMessage';

export interface IRoomWidgetHandler extends IDisposable
{
    update(): void;
    processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent;
    type: string;
    messageTypes: string[];
    eventTypes: string[];
    container: IRoomWidgetHandlerContainer;
}