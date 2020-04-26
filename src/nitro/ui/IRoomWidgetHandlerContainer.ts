import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { IRoomEngine } from '../room/IRoomEngine';

export interface IRoomWidgetHandlerContainer
{
    events: IEventDispatcher;
    roomEngine: IRoomEngine;
}