import { INitroManager } from '../../core/common/INitroManager';

export interface INitroWindowManager extends INitroManager
{
    getDesktop(roomId?: string): HTMLElement;
    addDesktop(roomId: string, desktop: HTMLElement): void;
    removeDesktop(roomId: string): void;
    getTemplate(name: string): string;
    renderElement(template: string, view: {}): HTMLElement;
    htmlToElement(html: string): HTMLElement;
    window: HTMLDivElement;
    roomId: string;
}