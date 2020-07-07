import { WindowTemplates } from '../../../window/WindowTemplates';
import { RoomWidgetUserInfostandUpdateEvent } from '../events/RoomWidgetUserInfostandUpdateEvent';
import { InfoStandWidget } from './InfoStandWidget';

export class InfoStandUserView 
{
    protected static _Str_6292: number = 0xFFFFFF;
    protected static _Str_6801: number = 9552639;

    private _Str_4882: number = 5;
    private _Str_14702: number = 3;
    private _Str_17178: number = 0xAAAAAA;
    private _Str_18971: number = 0xFFFFFF;
    private _Str_25347: number = 2000;
    private _Str_14746: number = 50;
    private _Str_13324: number = 23;
    private _Str_26389: number = 100;

    protected _widget: InfoStandWidget;
    protected _window: HTMLElement;
    // protected _Str_2373:IItemListWindow;
    // protected _Str_20844:IItemListWindow;
    // private _Str_2341:IBorderWindow;
    // private _Str_3306:TagListRenderer;
    // private _Str_2919:IBorderWindow;
    // private _Str_19966: number;
    // protected _Str_4966:IRegionWindow;

    constructor(k: InfoStandWidget, _arg_2: string)
    {
        this._widget    = k;
        this._window    = null;

        this.createWindow(_arg_2);
    }

    public dispose(): void
    {
        if(this._window)
        {
            if(this._window.parentElement) this._window.parentElement.removeChild(this._window);

            this._window = null;
        }

        this._widget = null;
    }

    public get window(): HTMLElement
    {
        return this._window;
    }

    protected updateWindow(): void
    {
        // if (((this._Str_2373 == null) || (this._Str_2341 == null)))
        // {
        //     return;
        // }
        // this._Str_2373.height = this._Str_2373._Str_2614.height;
        // this._Str_2341.height = (this._Str_2373.height + 20);
        // this._window.width = this._Str_2341.width;
        // this._window.height = this._window._Str_2614.height;
        // this._widget._Str_10301();
    }

    protected createWindow(k: string): void
    {
        this._window = this._widget.windowManager.renderElement(this.getTemplate(), {});

        this._window.style.display = 'none';

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

    public update(k: RoomWidgetUserInfostandUpdateEvent): void
    {
        this._Str_11602(k);
    }

    protected _Str_11602(k: RoomWidgetUserInfostandUpdateEvent): void
    {
        this.name = k.name;
        // this._Str_12782(k.motto, (k.type == RoomWidgetUpdateInfostandUserEvent.OWN_USER));
        // this.activityPoints = k.activityPoints;
        // this._Str_3249 = k._Str_3249;
        // this.xp = k.xp;
        this.figure = k.figure;
    }

    private getTemplate(): string
    {
        return this._widget.windowManager.getTemplate(WindowTemplates.INFOSTAND_MENU_USER_VIEW);
    }

    public set name(k: string)
    {
        const element = (this._window.querySelector('[data-tag="name-text"]') as HTMLElement);

        if(!element) return;

        element.innerText = k;
    }

    public set figure(figure: string)
    {
        const image = this._widget.handler.getUserImage(figure);

        if(image)
        {
            const element = (this._window.querySelector('[data-tag="image"]') as HTMLElement);

            if(element)
            {
                element.innerHTML = null;
                
                element.appendChild(image);
            }
        }
    }
}