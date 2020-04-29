import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { NitroEvent } from '../../core/events/NitroEvent';
import { IRoomSession } from '../session/IRoomSession';
import { INitroWindowManager } from '../window/INitroWindowManager';
import { RoomWidgetUpdateEvent } from './widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from './widget/messages/RoomWidgetMessage';

export interface IRoomDesktop 
{
    _Str_2485(_arg_1: NitroEvent):void;
    events: IEventDispatcher;
    windowManager: INitroWindowManager;
    roomSession: IRoomSession;
    processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    //_Str_11511(_arg_1:String):IRoomWidget;
}