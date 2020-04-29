import { INitroManager } from '../../core/common/INitroManager';

export interface INitroWindowManager extends INitroManager
{
    resize(): void;
    createElement(): HTMLDivElement;
    buildElementFromTemplate(template: string): HTMLDivElement;
    renderElement(element: HTMLElement, template: string, view: {}): void;
}