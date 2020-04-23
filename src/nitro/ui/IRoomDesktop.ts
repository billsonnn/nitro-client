import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { NitroEvent } from '../../core/events/NitroEvent';
import { IRoomSession } from '../session/IRoomSession';

export interface IRoomDesktop 
{
    events: IEventDispatcher;
    _Str_2485(_arg_1: NitroEvent):void;
    roomSession: IRoomSession;
    //processWidgetMessage(_arg_1:RoomWidgetMessage):RoomWidgetUpdateEvent;
    //_Str_11511(_arg_1:String):IRoomWidget;
}