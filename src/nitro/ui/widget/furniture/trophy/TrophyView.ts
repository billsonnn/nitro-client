import Mustache from 'mustache';
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
        if(!this._window)
        {
            this._window = document.createElement('div');

            document.body.appendChild(this._window);
        }

        const view = {
            message: this._widget.message,
            date: this._widget.date,
            name: this._widget.name
        };

        this._window.innerHTML = Mustache.render(this.getTemplate(), view);

        return true;
    }

    private getTemplate(): string
    {
        return `
        <div class="trophy">
            <div class="trophy-header">
            </div>
            <div class="trophy-content">
                {{ message }}
            </div>
            <div class="trophy-footer">
            {{ name }} | {{ date }}
            </div>
        </div>`;
    }
}