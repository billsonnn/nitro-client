import { RoomChatWidget } from './RoomChatWidget';

export class RoomChatView
{
    private _widget: RoomChatWidget;
    private _window: HTMLElement;
    private _chatsContainer: HTMLElement;

    constructor(widget: RoomChatWidget)
    {
        this._widget            = widget;
        this._window            = null;
        this._chatsContainer    = null;

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

            this._chatsContainer = (this._window.getElementsByClassName('room-chats-container')[0] as HTMLElement);
        }

        return true;
    }

    private getTemplate(): string
    {
        return `
        <div class="nitro-widget nitro-widget-room-chat">
            <div class="room-chats-container"></div>
        </div>`;
    }

    public get window(): HTMLElement
    {
        return this._window;
    }

    public get chatsContainer(): HTMLElement
    {
        return this._chatsContainer;
    }
}