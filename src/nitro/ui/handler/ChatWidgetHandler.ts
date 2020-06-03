import { IConnection } from '../../../core/communication/connections/IConnection';
import { NitroEvent } from '../../../core/events/NitroEvent';
import { IAvatarImageListener } from '../../avatar/IAvatarImageListener';
import { RoomSessionChatEvent } from '../../session/events/RoomSessionChatEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';
import { RoomChatWidget } from '../widget/roomchat/RoomChatWidget';

export class ChatWidgetHandler implements IRoomWidgetHandler, IAvatarImageListener
{
    private _container: IRoomWidgetHandlerContainer;
    private _widget: RoomChatWidget;

    private _connection: IConnection;

    private _disposed: boolean;

    constructor()
    {
        this._container     = null;
        this._widget        = null;

        this._connection    = null;

        this._disposed      = false;
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._container = null;
        this._widget    = null;
        this._disposed  = true;
    }

    public update(): void
    {

    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message || this._disposed) return null;

        switch(message.type)
        {

        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || this._disposed) return;
    }

    public resetFigure(figure: string): void
    {

    }

    public get type(): string
    {
        return RoomWidgetEnum.CHAT_WIDGET;
    }

    public get messageTypes(): string[]
    {
        return [ ];
    }

    public get eventTypes(): string[]
    {
        return [ RoomSessionChatEvent.CHAT_EVENT ];
    }

    public get container(): IRoomWidgetHandlerContainer
    {
        return this._container;
    }

    public set container(container: IRoomWidgetHandlerContainer)
    {
        this._container = container;
    }

    public get widget(): RoomChatWidget
    {
        return this._widget;
    }

    public set widget(widget: RoomChatWidget)
    {
        this._widget = widget;
    }

    public get connection(): IConnection
    {
        return this._connection;
    }

    public set connection(connection: IConnection)
    {
        this._connection = connection;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}