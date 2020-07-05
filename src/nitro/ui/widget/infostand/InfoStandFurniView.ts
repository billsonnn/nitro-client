import { WindowTemplates } from '../../../window/WindowTemplates';
import { RoomWidgetFurniInfostandUpdateEvent } from '../events/RoomWidgetFurniInfostandUpdateEvent';
import { InfoStandWidget } from './InfoStandWidget';

export class InfoStandFurniView 
{
    protected _widget: InfoStandWidget;
    protected _window: HTMLElement;
    protected _profileLinkElement: HTMLElement;

    constructor(k: InfoStandWidget, _arg_2: string)
    {
        this._widget                = k;
        this._window                = null;
        this._profileLinkElement    = null;

        this.createWindow(_arg_2);
    }

    public dispose(): void
    {
        // if (this._Str_4966)
        // {
        //     this._Str_4966.dispose();
        //     this._Str_4966 = null;
        // }
        this._widget = null;
        //this._window.dispose();
        this._window = null;
        // this._Str_3306.dispose();
        // this._Str_3306 = null;
        // this._Str_9682();
    }

    public get window(): HTMLElement
    {
        return this._window;
    }

    protected updateWindow(): void
    {
        
    }

    protected createWindow(k: string): void
    {
        this._window = this._widget.windowManager.renderElement(this.getTemplate(), {});

        if(!this._window) return;

        this._window.style.display = 'none';

        this._window.classList.add(k);

        if(this._widget.mainContainer) this._widget.mainContainer.appendChild(this._window);

        const closeElement = (this._window.querySelector('[data-tag="close"]') as HTMLElement);

        if(closeElement)
        {
            closeElement.onclick = event => this.onCloseHandler(event);
        }
    }

    private onCloseHandler(k: MouseEvent): void
    {
        this._widget.close();
    }

    public update(k: RoomWidgetFurniInfostandUpdateEvent): void
    {
        // this._Str_10630();
        // this._Str_21116();
        //this._Str_16673(k._Str_5235);
        // this._Str_17290([]);
        this._Str_11602(k);
    }

    protected _Str_11602(k: RoomWidgetFurniInfostandUpdateEvent): void
    {
        this.name           = k.name;
        this.description    = k.description;
        this.image          = k.image;
        this.ownerName      = k.ownerName;
    }

    private getTemplate(): string
    {
        return this._widget.windowManager.getTemplate(WindowTemplates.INFOSTAND_MENU_FURNI_VIEW);
    }

    private set name(value: string)
    {
        const element = (this._window.querySelector('[data-tag="name-text"]') as HTMLElement);

        if(!element) return;

        element.innerText = value;
    }

    private set description(value: string)
    {
        const element = (this._window.querySelector('[data-tag="desc-text"]') as HTMLElement);

        if(!element) return;

        element.innerText = value;
    }

    private set ownerName(value: string)
    {
        const element = (this._window.querySelector('[data-tag="owner-text"]') as HTMLElement);

        if(!element) return;

        element.innerText = value;
    }

    private set image(image: HTMLImageElement)
    {
        if(!image) return;
        
        const element = (this._window.querySelector('[data-tag="image"]'));

        if(element)
        {
            element.innerHTML = null;
            
            element.appendChild(image);
        }
    }
}