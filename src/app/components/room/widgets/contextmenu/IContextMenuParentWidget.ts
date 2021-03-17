import { ComponentRef } from '@angular/core';
import { IRoomWidgetMessageListener } from 'nitro-renderer/src/nitro/ui/widget/IRoomWidgetMessageListener';
import { ContextInfoView } from './ContextInfoView';

export interface IContextMenuParentWidget
{
    removeView(view: ComponentRef<ContextInfoView>, flag: boolean): void;
    messageListener: IRoomWidgetMessageListener;
}
