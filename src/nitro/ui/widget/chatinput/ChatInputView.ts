import { SystemChatStyleEnum } from '../enums/SystemChatStyleEnum';
import { RoomWidgetChatMessage } from '../messages/RoomWidgetChatMessage';
import { RoomWidgetChatTypingMessage } from '../messages/RoomWidgetChatTypingMessage';
import { ChatInputWidget } from './ChatInputWidget';

export class ChatInputView
{
    private _widget: ChatInputWidget;
    private _window: HTMLElement;

    private _inputField: HTMLInputElement;
    private _isTyping: boolean;
    private _typingStartedSent: boolean;
    private _lastContent: string;

    constructor(widget: ChatInputWidget)
    {
        this._widget            = widget;
        this._window            = null;

        this._inputField        = null;
        this._isTyping          = false;
        this._typingStartedSent = false;
        this._lastContent       = '';

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

        const inputElement = this._window.getElementsByClassName('chat-input')[0];

        if(inputElement)
        {
            this._inputField = (inputElement as HTMLInputElement);

            this._inputField.addEventListener('mousedown', this.windowMouseEventProcessor.bind(this));
            this._inputField.addEventListener('keydown', this.onKeyDownEvent.bind(this));
            this._inputField.addEventListener('keyup', this.onKeyUpEvent.bind(this));
        }

        return true;
    }

    private getTemplate(): string
    {
        return `
        <div class="nitro-widget nitro-widget-chat-input">
            <div class="widget-body">
                <input type="text" class="chat-input" />
            </div>
        </div>`;
    }

    private windowMouseEventProcessor(): void
    {
        this.setInputFieldFocus();
    }

    private onKeyDownEvent(event: KeyboardEvent): void
    {
        const key       = event.keyCode;
        const shiftKey  = event.shiftKey;

        switch(key)
        {
            case 32: // SPACE
                this.checkSpecialKeywordForInput();
                break;
            case 13: // ENTER
                this.sendChatFromInputField(shiftKey);
                return;
        }
    }

    private onKeyUpEvent(event: KeyboardEvent): void
    {
        
    }

    private sendChatFromInputField(shiftKey: boolean = false): void
    {
        if(!this._inputField || (this._inputField.value === '')) return;

        let chatType        = (shiftKey ? RoomWidgetChatMessage.CHAT_SHOUT : RoomWidgetChatMessage.CHAT_DEFAULT);
        let text            = this._inputField.value;
        
        const parts         = text.split(' ');

        let recipientName   = '';
        let append          = '';

        switch(parts[0])
        {
            case ':whisper':
                chatType        = RoomWidgetChatMessage.CHAT_WHISPER;
                recipientName   = parts[1];
                append          = (`:whisper ${ recipientName } `);

                parts.shift();
                parts.shift();
                break;
            case ':shout':
                chatType = RoomWidgetChatMessage.CHAT_SHOUT;

                parts.shift();
                break;
            case ':speak':
                chatType = RoomWidgetChatMessage.CHAT_DEFAULT;

                parts.shift();
                break;
        }

        text = parts.join(' ');

        let chatStyle = SystemChatStyleEnum.NORMAL;

        if(this._widget)
        {
            this._widget.sendChat(text, chatType, recipientName, chatStyle);

            this._isTyping = false;

            if(this._typingStartedSent) this.sendTypingMessage();

            this._typingStartedSent = false;
        }

        this._inputField.value  = append;
        this._lastContent       = append;
    }

    private sendTypingMessage(): void
    {
        if(!this._widget || this._widget.floodBlocked) return;

        this._widget.messageListener.processWidgetMessage(new RoomWidgetChatTypingMessage(this._isTyping));
    }

    private setInputFieldFocus(): void
    {
        if(!this._inputField) return;

        this._inputField.focus();
    }

    private checkSpecialKeywordForInput(): void
    {
        if(!this._inputField || (this._inputField.value === '')) return;

        const text              = this._inputField.value;
        const selectedUsername  = this._widget.selectedUsername;

        if((text !== ':whisper') || (selectedUsername.length === 0)) return;

        this._inputField.value = `${ this._inputField.value } ${ this._widget.selectedUsername }`;
    }

    public get window(): HTMLElement
    {
        return this._window;
    }
}