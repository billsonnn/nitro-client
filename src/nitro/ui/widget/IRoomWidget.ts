import { IEventDispatcher } from '../../../core/events/IEventDispatcher';
import { INitroWindowManager } from '../../window/INitroWindowManager';
import { DesktopLayoutManager } from '../DesktopLayoutManager';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetMessageListener } from './IRoomWidgetMessageListener';

export interface IRoomWidget
{
    initialize(_arg_1?: number): void;
    dispose(): void;
    registerUpdateEvents(eventDispatcher: IEventDispatcher): void;
    unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void;
    widgetHandler: IRoomWidgetHandler;
    windowManager: INitroWindowManager;
    layoutManager: DesktopLayoutManager;
    mainWindow: HTMLElement;
    messageListener: IRoomWidgetMessageListener;
    state: number;
}