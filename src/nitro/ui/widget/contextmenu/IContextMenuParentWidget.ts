import { INitroWindowManager } from '../../../window/INitroWindowManager';
import { IRoomWidgetMessageListener } from '../IRoomWidgetMessageListener';
import { ContextInfoView } from './ContextInfoView';

export interface IContextMenuParentWidget 
{
    removeView(_arg_1: ContextInfoView, _arg_2: boolean): void;
    windowManager: INitroWindowManager;
    messageListener: IRoomWidgetMessageListener;
}