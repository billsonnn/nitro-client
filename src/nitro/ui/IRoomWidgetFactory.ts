import { IRoomWidgetHandler } from './IRoomWidgetHandler';
import { IRoomWidget } from './widget/IRoomWidget';

export interface IRoomWidgetFactory
{
    createWidget(type: string, handler: IRoomWidgetHandler): IRoomWidget;
}