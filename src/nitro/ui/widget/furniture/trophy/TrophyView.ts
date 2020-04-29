import { ITrophyFurniWidget } from './ITrophyFurniWidget';
import { ITrophyView } from './ITrophyView';

export class TrophyView implements ITrophyView
{
    private _widget: ITrophyFurniWidget;
    private _window: HTMLElement;

    constructor(widget: ITrophyFurniWidget)
    {
        this._widget    = widget;
        this._window    = null;
    }

    public dispose(): void
    {
        this.disposeWindow();

        this._widget = null;
    }

    public disposeWindow(): void
    {
        if(this._window)
        {
            this._window.remove();

            this._window = null;
        }
    }

    public render(): boolean
    {
        if(!this._window) this._window = this._widget.windowManager.createElement();

        const view = {
            message: this._widget.message,
            date: this._widget.date,
            name: this._widget.name
        };

        this._widget.windowManager.renderElement(this._window, this.getTemplate(), view);

        return true;
    }

    private getTemplate(): string
    {
        return `
        <div class="nitro-widget nitro-widget-trophy">
            <div class="widget-header">
                <div class="header-title">Trophy</div>
                <div class="header-close" [close]><i className="fas fa-times"></i></div>
            </div>
            <div class="widget-body">
                {{ message }}
            </div>
            <div class="widget-footer">
                {{ name }} | {{ date }}
            </div>
        </div>`;
    }
}