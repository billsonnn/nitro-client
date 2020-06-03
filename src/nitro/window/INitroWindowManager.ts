import { INitroManager } from '../../core/common/INitroManager';

export interface INitroWindowManager extends INitroManager
{
    resize(): void;
    renderElement(template: string, view: {}): HTMLElement;
    htmlToElement(html: string): HTMLElement;
    window: HTMLDivElement;
}