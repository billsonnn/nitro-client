import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { NitroEvent } from '../../core/events/NitroEvent';
import { IRoomSession } from '../session/IRoomSession';
import { INitroWindowManager } from '../window/INitroWindowManager';
import { DesktopLayoutManager } from './DesktopLayoutManager';
import { RoomWidgetUpdateEvent } from './widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from './widget/messages/RoomWidgetMessage';

export interface IRoomDesktop 
{
    events: IEventDispatcher;
    windowManager: INitroWindowManager;
    layoutManager: DesktopLayoutManager;
    roomSession: IRoomSession;
    processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent;
    processEvent(event: NitroEvent): void;
    //_Str_11511(_arg_1:String):IRoomWidget;
}