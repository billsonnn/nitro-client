import { ChatInputWidget } from './ChatInputWidget';

export class ChatInputView
{
    private _widget: ChatInputWidget;
    private _window: HTMLElement;

    constructor(widget: ChatInputWidget)
    {
        this._widget    = widget;
        this._window    = null;

        this.render();
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
            const view = {
            };

            this._window = this._widget.windowManager.renderElement(this.getTemplate(), view);
        }

        return true;
    }

    private getTemplate(): string
    {
        return `
        <div class="nitro-widget nitro-widget-chat-input">
            <div class="widget-body">
                chat input!!
            </div>
        </div>`;
    }

    public get window(): HTMLElement
    {
        return this._window;
    }
}