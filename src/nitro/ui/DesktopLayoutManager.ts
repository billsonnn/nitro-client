import { INitroWindowManager } from '../window/INitroWindowManager';
import { RoomWidgetEnum } from './widget/enums/RoomWidgetEnum';

export class DesktopLayoutManager
{
    private _container: HTMLElement;
    private _widgetContainer: HTMLElement;
    private _windowManager: INitroWindowManager;

    constructor()
    {
        this._container         = null;
        this._widgetContainer   = null;
    }

    public dispose(): void
    {
        if(this._widgetContainer)
        {
            this._widgetContainer.remove();

            this._widgetContainer = null;
        }

        if(this._container)
        {
            if(this._windowManager)
            {
                this._windowManager.removeDesktop(this._windowManager.roomId);
            }
            else
            {
                if(this._container.parentElement) this._container.parentElement.removeChild(this._container);
            }

            this._container = null;
        }
    }

    public setLayout(layout: string, windowManager: INitroWindowManager): void
    {
        if(!layout || !windowManager) return;

        const container = windowManager.window;

        if(!container) return;

        const element = windowManager.htmlToElement(layout);

        windowManager.addDesktop(windowManager.roomId, element);

        this._container     = element;
        this._windowManager = windowManager;
    }

    public addWidgetWindow(type: string, window: HTMLElement): boolean
    {
        if(!window) return false;

        const container = this.getWidgetContainer(type);

        if(container)
        {
            container.appendChild(window);

            return true;
        }
        
        window.remove();

        return false;
    }

    private getWidgetContainer(type: string): HTMLElement
    {
        if(!this._container) return null;

        if(type === RoomWidgetEnum.CHAT_INPUT_WIDGET)
        {
            return this._container;
        }

        if(this._widgetContainer) return this._widgetContainer;

        const widgetContainer = document.createElement('div');

        widgetContainer.className = 'ntiro-widget-container';

        this._widgetContainer = widgetContainer;

        this._container.appendChild(this._widgetContainer);

        return this._widgetContainer;
    }
    
    public getRectangle(): PIXI.Rectangle
    {
        const bounds = this._container.getBoundingClientRect();

        return new PIXI.Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
    }
}