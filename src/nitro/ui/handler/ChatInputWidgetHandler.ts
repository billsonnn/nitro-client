import { NitroEvent } from '../../../core/events/NitroEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { ChatInputWidget } from '../widget/chatinput/ChatInputWidget';
import { RoomWidgetEnum } from '../widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetChatMessage } from '../widget/messages/RoomWidgetChatMessage';
import { RoomWidgetChatSelectAvatarMessage } from '../widget/messages/RoomWidgetChatSelectAvatarMessage';
import { RoomWidgetChatTypingMessage } from '../widget/messages/RoomWidgetChatTypingMessage';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';

export class ChatInputWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetHandlerContainer;
    private _mouseToggle: boolean;
    private _widget: ChatInputWidget;

    private _disposed: boolean;

    constructor()
    {
        this._container     = null;
        this._mouseToggle   = true;
        this._widget        = null;

        this._disposed      = false;
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._container     = null;
        this._widget        = null;
        this._disposed      = true;
    }

    public update(): void
    {

    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message || this.disposed) return null;

        let widgetMessage: RoomWidgetMessage = null;

        switch(message.type)
        {
            case RoomWidgetChatTypingMessage.TYPING_STATUS:
                widgetMessage = message;
                break;
            case RoomWidgetChatMessage.MESSAGE_CHAT:
                widgetMessage = message;
                break;
            case RoomWidgetChatSelectAvatarMessage.SELECT_AVATAR:
                widgetMessage = message;
                break;
        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || this._disposed) return;
    }

    public get type(): string
    {
        return RoomWidgetEnum.CHAT_INPUT_WIDGET;
    }

    public get messageTypes(): string[]
    {
        return [ RoomWidgetChatTypingMessage.TYPING_STATUS, RoomWidgetChatMessage.MESSAGE_CHAT, RoomWidgetChatSelectAvatarMessage.SELECT_AVATAR ];
    }

    public get eventTypes(): string[]
    {
        return [ ];
    }

    public get container(): IRoomWidgetHandlerContainer
    {
        return this._container;
    }

    public set container(container: IRoomWidgetHandlerContainer)
    {
        this._container = container;
    }

    public get widget(): ChatInputWidget
    {
        return this._widget;
    }

    public set widget(widget: ChatInputWidget)
    {
        this._widget = widget;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}