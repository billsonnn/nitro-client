import { INitroManager } from '../../core/common/INitroManager';

export interface INitroWindowManager extends INitroManager
{
    renderElement(template: string, view: {}): HTMLElement;
    htmlToElement(html: string): HTMLElement;
    window: HTMLDivElement;
}