import { INitroWindowManager } from '../window/INitroWindowManager';
import { RoomWidgetEnum } from './widget/enums/RoomWidgetEnum';

export class DesktopLayoutManager
{
    private _container: HTMLElement;

    constructor()
    {
        this._container = null;
    }

    public dispose(): void
    {
        if(this._container)
        {
            this._container.remove();

            this._container = null;
        }
    }

    public setLayout(layout: string, windowManager: INitroWindowManager): void
    {
        if(!layout || !windowManager) return;

        const container = windowManager.window;

        if(!container) return;

        const element = windowManager.htmlToElement(layout);

        container.append(element);

        this._container = element;
    }

    public addWidgetWindow(type: string, window: HTMLElement): boolean
    {
        if(!window) return false;

        const container = this.getWidgetContainer(type, window);

        if(!container) return false;

        if(type === RoomWidgetEnum.CHAT_INPUT_WIDGET)
        {
            container.append(window);

            return true;
        }

        window.style.top = '0px';
        window.style.left = '0px';

        container.append(window);

        return true;
    }

    private getWidgetContainer(type: string, window: HTMLElement): HTMLElement
    {
        if(!window) return null;

        if(type === RoomWidgetEnum.CHAT_INPUT_WIDGET)
        {
            return this._container;
        }
        
        return ((this._container.getElementsByClassName('room-widget-container')[0] as HTMLElement) || null);
    }
}