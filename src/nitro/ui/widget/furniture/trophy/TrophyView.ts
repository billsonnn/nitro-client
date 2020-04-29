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
            name: this._widget.name,
            color: this._widget.color
        };

        this._widget.windowManager.renderElement(this._window, this.getTemplate(), view);

        const closeHandler = this._window.getElementsByClassName('close-handler')[0] as HTMLElement;

        if(closeHandler) closeHandler.onclick = this.disposeWindow.bind(this);

        return true;
    }

    private getTemplate(): string
    {
        return `
        <div class="nitro-widget nitro-widget-trophy trophy-color-{{ color }}">
            <div class="widget-header drag-handler">
                <div class="header-title">Trophy</div>
                <div class="header-close close-handler"><i class="fas fa-times"></i></div>
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