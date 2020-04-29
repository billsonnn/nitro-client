import { IEventDispatcher } from '../../../core/events/IEventDispatcher';
import { INitroWindowManager } from '../../window/INitroWindowManager';
import { IRoomWidgetMessageListener } from './IRoomWidgetMessageListener';

export interface IRoomWidget
{
    initialize(_arg_1?: number): void;
    dispose(): void;
    registerUpdateEvents(eventDispatcher: IEventDispatcher): void;
    unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void;
    windowManager: INitroWindowManager;
    messageListener: IRoomWidgetMessageListener;
    state: number;
}