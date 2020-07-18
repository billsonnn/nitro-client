import { SystemChatStyleEnum } from '../enums/SystemChatStyleEnum';
import { RoomWidgetChatMessage } from '../messages/RoomWidgetChatMessage';
import { RoomWidgetChatTypingMessage } from '../messages/RoomWidgetChatTypingMessage';
import { ChatInputWidget } from './ChatInputWidget';

export class ChatInputView
{
    private _widget: ChatInputWidget;
    private _window: HTMLElement;

    private _inputField: HTMLInputElement;
    private _lastContent: string;

    private _isTyping: boolean;
    private _typingStartedSent: boolean;
    private _typingTimer: any;
    private _idleTimer: any;

    constructor(widget: ChatInputWidget)
    {
        this._widget            = widget;
        this._window            = null;

        this._inputField        = null;
        this._lastContent       = '';

        this._isTyping          = false;
        this._typingStartedSent = false;
        this._typingTimer       = null;
        this._idleTimer         = null;

        this.render();
    }

    public dispose(): void
    {
        if(this._inputField)
        {
            this._inputField.removeEventListener('mousedown', this.onInputMouseDownEvent.bind(this));
            this._inputField.removeEventListener('input', this.onInputChangeEvent.bind(this));

            this._inputField = null;
        }

        document.body.removeEventListener('keydown', this.onKeyDownEvent.bind(this));
        
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

            document.body.addEventListener('keydown', this.onKeyDownEvent.bind(this));

            this._inputField.addEventListener('mousedown', this.onInputMouseDownEvent.bind(this));
            this._inputField.addEventListener('input', this.onInputChangeEvent.bind(this));
        }

        return true;
    }

    private getTemplate(): string
    {
        return `
        <div class="nitro-widget nitro-widget-chat-input">
            <div class="widget-body">
                <button class="btn btn-destiny">Styles</button>
                <input type="text" class="chat-input" />
            </div>
        </div>`;
    }

    private onKeyDownEvent(event: KeyboardEvent): void
    {
        if(!this._widget) return;

        if(this.anotherInputHasFocus()) return;

        this.setInputFocus();

        const key       = event.keyCode;
        const shiftKey  = event.shiftKey;

        switch(key)
        {
            case 32: // SPACE
                this.checkSpecialKeywordForInput();
                return;
            case 13: // ENTER
                this.sendChatFromInputField(shiftKey);
                return;
            case 8: // BACKSPACE
                if(this._inputField)
                {
                    const value = this._inputField.value;
                    const parts = value.split(' ');

                    if((parts[0] === ':whisper') && (parts.length === 3) && (parts[2] === ''))
                    {
                        this._inputField.value  = '';
                        this._lastContent       = '';
                    }
                }
                return;
        }
    }

    private onInputMouseDownEvent(event: MouseEvent): void
    {
        this.setInputFocus();
    }

    private onInputChangeEvent(event: InputEvent): void
    {
        const input = (event.target as HTMLInputElement);

        if(!input) return;

        const value = input.value;

        if(!value.length)
        {
            this._isTyping = false;

            this.startTypingTimer();
        }
        else
        {
            this._lastContent = value;

            if (!this._isTyping)
            {
                this._isTyping = true;

                this.startTypingTimer();
            }

            this.startIdleTimer();
        }
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
            if(this._typingTimer) this.resetTypingTimer();

            if(this._idleTimer) this.resetIdleTimer();
            
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

    private anotherInputHasFocus(): boolean
    {
        const activeElement = document.activeElement;

        if(!activeElement) return false;

        if(this._inputField && (this._inputField === activeElement)) return false;

        if(!(activeElement instanceof HTMLInputElement)) return false;

        return true;
    }

    private setInputFocus(): void
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

    private startIdleTimer(): void
    {
        this.resetIdleTimer();

        this._idleTimer = setTimeout(this.onIdleTimerComplete.bind(this), 10000);
    }

    private resetIdleTimer(): void
    {
        if(this._idleTimer)
        {
            clearTimeout(this._idleTimer);

            this._idleTimer = null;
        }
    }

    private onIdleTimerComplete(): void
    {
        if(this._isTyping) this._typingStartedSent = false;

        this._isTyping = false;

        this.sendTypingMessage();
    }

    private startTypingTimer(): void
    {
        this.resetTypingTimer();

        this._typingTimer = setTimeout(this.onTypingTimerComplete.bind(this), 1000);
    }

    private resetTypingTimer(): void
    {
        if(this._typingTimer)
        {
            clearTimeout(this._typingTimer);

            this._typingTimer = null;
        }
    }

    private onTypingTimerComplete(): void
    {
        if(this._isTyping) this._typingStartedSent = true;

        this.sendTypingMessage();
    }

    public get window(): HTMLElement
    {
        return this._window;
    }
}