import { ComponentRef } from '@angular/core';
import { IRoomWidgetMessageListener } from '../../../../../client/nitro/ui/widget/IRoomWidgetMessageListener';
import { ContextInfoView } from './ContextInfoView';

export interface IContextMenuParentWidget 
{
    removeView(view: ComponentRef<ContextInfoView>, flag: boolean): void;
    messageListener: IRoomWidgetMessageListener;
}