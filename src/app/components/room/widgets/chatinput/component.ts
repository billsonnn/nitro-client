import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IEventDispatcher } from '../../../../../client/core/events/IEventDispatcher';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { ConversionTrackingWidget } from '../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { SystemChatStyleEnum } from '../../../../../client/nitro/ui/widget/enums/SystemChatStyleEnum';
import { RoomWidgetChatInputContentUpdateEvent } from '../events/RoomWidgetChatInputContentUpdateEvent';
import { RoomWidgetFloodControlEvent } from '../events/RoomWidgetFloodControlEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetUpdateInfostandUserEvent } from '../events/RoomWidgetUpdateInfostandUserEvent';
import { ChatInputWidgetHandler } from '../handlers/ChatInputWidgetHandler';
import { RoomWidgetChatMessage } from '../messages/RoomWidgetChatMessage';
import { RoomWidgetChatTypingMessage } from '../messages/RoomWidgetChatTypingMessage';

@Component({
    selector: 'nitro-room-chatinput-component',
    template: `
    <div class="nitro-room-chatinput-component">
        <div class="chatinput-container">
            <div class="input-sizer">
                <input #chatInputView type="text" class="chat-input" placeholder="{{ 'widgets.chatinput.default' | translate }}" (input)="chatInputView.parentElement.dataset.value = chatInputView.value" [maxLength]="inputMaxLength" />
            </div>
        </div>
        <nitro-room-chatinput-styleselector-component (styleSelected)="onStyleSelected($event)"></nitro-room-chatinput-styleselector-component>
    </div>`
})
export class RoomChatInputComponent extends ConversionTrackingWidget implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('chatInputView')
    public chatInputView: ElementRef<HTMLInputElement>;

    public selectedUsername: string                     = '';
    public floodBlocked: boolean                        = false;
    public lastContent: string                          = '';
    public isTyping: boolean                            = false;
    public typingStartedSent: boolean                   = false;
    public typingTimer: ReturnType<typeof setTimeout>   = null;
    public idleTimer: ReturnType<typeof setTimeout>     = null;
    public currentStyle: number                         = -1;
    public needsStyleUpdate: boolean                    = false;

    private _chatModeIdWhisper: string                  = null;
    private _chatModeIdShout: string                    = null;
    private _chatModeIdSpeak: string                    = null;
    private _maxChatLength: number                      = 0;

    constructor(
        private ngZone: NgZone
    )
    {
        super();

        this.onKeyDownEvent                             = this.onKeyDownEvent.bind(this);
        this.onInputMouseDownEvent                      = this.onInputMouseDownEvent.bind(this);
        this.onInputChangeEvent                         = this.onInputChangeEvent.bind(this);
        this.onRoomWidgetRoomObjectUpdateEvent          = this.onRoomWidgetRoomObjectUpdateEvent.bind(this);
        this.onRoomWidgetUpdateInfostandUserEvent       = this.onRoomWidgetUpdateInfostandUserEvent.bind(this);
        this.onRoomWidgetChatInputContentUpdateEvent    = this.onRoomWidgetChatInputContentUpdateEvent.bind(this);
        this.onRoomWidgetFloodControlEvent              = this.onRoomWidgetFloodControlEvent.bind(this);
        this.onIdleTimerComplete                        = this.onIdleTimerComplete.bind(this);
        this.onTypingTimerComplete                      = this.onTypingTimerComplete.bind(this);
    }

    public ngOnInit(): void
    {
        this._chatModeIdWhisper = Nitro.instance.getLocalization('widgets.chatinput.mode.whisper');
        this._chatModeIdShout   = Nitro.instance.getLocalization('widgets.chatinput.mode.shout');
        this._chatModeIdSpeak   = Nitro.instance.getLocalization('widgets.chatinput.mode.speak');
        this._maxChatLength     = Nitro.instance.getConfiguration<number>('chat.input.maxlength', 100);
    }

    public ngAfterViewInit(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            document.body.addEventListener('keydown', this.onKeyDownEvent);

            if(this.inputView)
            {
                this.inputView.addEventListener('mousedown', this.onInputMouseDownEvent);
                this.inputView.addEventListener('input', this.onInputChangeEvent);
            }
        });
    }

    public ngOnDestroy(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            document.body.removeEventListener('keydown', this.onKeyDownEvent);

            if(this.inputView)
            {
                this.inputView.removeEventListener('mousedown', this.onInputMouseDownEvent);
                this.inputView.removeEventListener('input', this.onInputChangeEvent);
            }
        });
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.onRoomWidgetRoomObjectUpdateEvent);
        eventDispatcher.addEventListener(RoomWidgetUpdateInfostandUserEvent.PEER, this.onRoomWidgetUpdateInfostandUserEvent);
        eventDispatcher.addEventListener(RoomWidgetChatInputContentUpdateEvent.RWWCIDE_CHAT_INPUT_CONTENT, this.onRoomWidgetChatInputContentUpdateEvent);
        eventDispatcher.addEventListener(RoomWidgetFloodControlEvent.RWFCE_FLOOD_CONTROL, this.onRoomWidgetFloodControlEvent);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.onRoomWidgetRoomObjectUpdateEvent);
        eventDispatcher.removeEventListener(RoomWidgetUpdateInfostandUserEvent.PEER, this.onRoomWidgetUpdateInfostandUserEvent);
        eventDispatcher.removeEventListener(RoomWidgetChatInputContentUpdateEvent.RWWCIDE_CHAT_INPUT_CONTENT, this.onRoomWidgetChatInputContentUpdateEvent);
        eventDispatcher.removeEventListener(RoomWidgetFloodControlEvent.RWFCE_FLOOD_CONTROL, this.onRoomWidgetFloodControlEvent);
    }

    private onRoomWidgetRoomObjectUpdateEvent(event: RoomWidgetRoomObjectUpdateEvent): void
    {
        this.selectedUsername = '';
    }

    private onRoomWidgetUpdateInfostandUserEvent(event: RoomWidgetUpdateInfostandUserEvent): void
    {
        if(!event) return;

        this.selectedUsername = event.name;
    }

    private onRoomWidgetChatInputContentUpdateEvent(event: RoomWidgetChatInputContentUpdateEvent): void
    {
        if(!event) return;

        switch(event._Str_23621)
        {
            case RoomWidgetChatInputContentUpdateEvent.WHISPER: {
                const localization = Nitro.instance.getLocalization('widgets.chatinput.mode.whisper');

                this.inputView.value = localization + ' ' + event.userName + ' ';
                return;
            }
            case RoomWidgetChatInputContentUpdateEvent.SHOUT:
                return;
        }
    }

    private onRoomWidgetFloodControlEvent(event: RoomWidgetFloodControlEvent): void
    {
        if(!event) return;
    }

    public sendChat(text: string, chatType: number, recipientName: string = '', styleId: number = 0): void
    {
        if(this.floodBlocked || !this.messageListener) return;

        this.chatInputView.nativeElement.parentElement.dataset.value = this.chatInputView.nativeElement.value = '';

        this.messageListener.processWidgetMessage(new RoomWidgetChatMessage(RoomWidgetChatMessage.MESSAGE_CHAT, text, chatType, recipientName, styleId));
    }

    public onChange(event: KeyboardEvent): void
    {
        if(!event) return;

        //this._chatViewInput.parentElement.dataset.value = this._chatViewInput.value
    }

    private onKeyDownEvent(event: KeyboardEvent): void
    {
        if(!event) return;

        if(this.anotherInputHasFocus()) return;

        const input = this.chatInputView && this.chatInputView.nativeElement;

        if(document.activeElement !== input) this.setInputFocus();

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
                if(this.inputView)
                {
                    const value = this.inputView.value;
                    const parts = value.split(' ');

                    if((parts[0] === this._chatModeIdWhisper) && (parts.length === 3) && (parts[2] === ''))
                    {
                        this.inputView.value    = '';
                        this.lastContent        = '';
                    }
                }
                return;
            default:
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
            this.isTyping = false;

            this.startTypingTimer();
        }
        else
        {
            this.lastContent = value;

            if(!this.isTyping)
            {
                this.isTyping = true;

                this.startTypingTimer();
            }

            this.startIdleTimer();
        }
    }

    public onStyleSelected(styleId: number): void
    {
        if(styleId === this.currentStyle) return;

        this.currentStyle       = styleId;
        this.needsStyleUpdate   = true;
    }

    private sendChatFromInputField(shiftKey: boolean = false): void
    {
        if(!this.inputView || (this.inputView.value === '')) return;

        let chatType        = (shiftKey ? RoomWidgetChatMessage.CHAT_SHOUT : RoomWidgetChatMessage.CHAT_DEFAULT);
        let text            = this.inputView.value;

        const parts         = text.split(' ');

        let recipientName   = '';
        let append          = '';

        switch(parts[0])
        {
            case this._chatModeIdWhisper:
                chatType        = RoomWidgetChatMessage.CHAT_WHISPER;
                recipientName   = parts[1];
                append          = (this._chatModeIdWhisper + ' ' + recipientName + ' ');

                parts.shift();
                parts.shift();
                break;
            case this._chatModeIdShout:
                chatType = RoomWidgetChatMessage.CHAT_SHOUT;

                parts.shift();
                break;
            case this._chatModeIdSpeak:
                chatType = RoomWidgetChatMessage.CHAT_DEFAULT;

                parts.shift();
                break;
        }

        text = parts.join(' ');

        const chatStyle = SystemChatStyleEnum.NORMAL;

        if(this.typingTimer) this.resetTypingTimer();

        if(this.idleTimer) this.resetIdleTimer();

        if(text.length <= this._maxChatLength) this.sendChat(text, chatType, recipientName, this.currentStyle);

        this.isTyping = false;

        if(this.typingStartedSent) this.sendTypingMessage();

        this.typingStartedSent = false;

        this.inputView.value    = append;
        this.lastContent        = append;
    }

    private sendTypingMessage(): void
    {
        if(this.floodBlocked || !this.messageListener) return;

        this.messageListener.processWidgetMessage(new RoomWidgetChatTypingMessage(this.isTyping));
    }

    private anotherInputHasFocus(): boolean
    {
        const activeElement = document.activeElement;

        if(!activeElement) return false;

        if(this.chatInputView && this.chatInputView.nativeElement && (this.chatInputView.nativeElement === activeElement)) return false;

        if((!(activeElement instanceof HTMLInputElement) && !(activeElement instanceof HTMLTextAreaElement))) return false;

        return true;
    }

    private setInputFocus(): void
    {
        const input = this.chatInputView && this.chatInputView.nativeElement;

        if(!input) return;

        input.focus();

        input.setSelectionRange((input.value.length * 2), (input.value.length * 2));
    }

    private checkSpecialKeywordForInput(): void
    {
        const inputView = ((this.chatInputView && this.chatInputView.nativeElement) || null);

        if(!inputView || (inputView.value === '')) return;

        const text              = inputView.value;
        const selectedUsername  = this.selectedUsername;

        if((text !== this._chatModeIdWhisper) || (selectedUsername.length === 0)) return;

        inputView.value = `${ inputView.value } ${ this.selectedUsername }`;
    }

    private startIdleTimer(): void
    {
        this.resetIdleTimer();

        this.idleTimer = setTimeout(this.onIdleTimerComplete, 10000);
    }

    private resetIdleTimer(): void
    {
        if(this.idleTimer)
        {
            clearTimeout(this.idleTimer);

            this.idleTimer = null;
        }
    }

    private onIdleTimerComplete(): void
    {
        if(this.isTyping) this.typingStartedSent = false;

        this.isTyping = false;

        this.sendTypingMessage();
    }

    private startTypingTimer(): void
    {
        this.resetTypingTimer();

        this.typingTimer = setTimeout(this.onTypingTimerComplete, 1000);
    }

    private resetTypingTimer(): void
    {
        if(this.typingTimer)
        {
            clearTimeout(this.typingTimer);

            this.typingTimer = null;
        }
    }

    private onTypingTimerComplete(): void
    {
        if(this.isTyping) this.typingStartedSent = true;

        this.sendTypingMessage();
    }

    public get inputMaxLength(): number
    {
        return this._maxChatLength;
    }

    public get inputView(): HTMLInputElement
    {
        return ((this.chatInputView && this.chatInputView.nativeElement) || null);
    }

    public get handler(): ChatInputWidgetHandler
    {
        return (this.widgetHandler as ChatInputWidgetHandler);
    }

}