import { IEventDispatcher } from '../../../../core/events/IEventDispatcher';
import { INitroWindowManager } from '../../../window/INitroWindowManager';
import { DesktopLayoutManager } from '../../DesktopLayoutManager';
import { ChatInputWidgetHandler } from '../../handler/ChatInputWidgetHandler';
import { IRoomDesktop } from '../../IRoomDesktop';
import { IRoomWidgetHandler } from '../../IRoomWidgetHandler';
import { RoomUI } from '../../RoomUI';
import { ConversionTrackingWidget } from '../ConversionTrackingWidget';
import { RoomWidgetRoomObjectUpdateEvent } from '../events/RoomWidgetRoomObjectUpdateEvent';
import { ChatInputView } from './ChatInputView';
import { RoomWidgetChatMessage } from '../messages/RoomWidgetChatMessage';

export class ChatInputWidget extends ConversionTrackingWidget
{
    private _roomUI: RoomUI;
    private _roomDesktop: IRoomDesktop;
    private _view: ChatInputView;

    private _selectedUsername: string;
    private _floodBlocked: boolean;
    private _releaseTimer: any;

    constructor(handler: IRoomWidgetHandler, windowManager: INitroWindowManager, layoutManager: DesktopLayoutManager, roomUI: RoomUI, roomDesktop: IRoomDesktop)
    {
        super(handler, windowManager, layoutManager);

        this._roomUI            = roomUI;
        this._roomDesktop       = roomDesktop;
        this._view              = new ChatInputView(this);

        this._selectedUsername  = '';
        this._floodBlocked      = false;
        this._releaseTimer      = null;

        (handler as ChatInputWidgetHandler).widget = this;
    }

    public dispose(): void
    {
        if(this._view)
        {
            this._view.dispose();

            this._view = null;
        }

        this._roomUI = null;

        super.dispose();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.onRoomWidgetRoomObjectUpdateEvent.bind(this));

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.onRoomWidgetRoomObjectUpdateEvent.bind(this));
    }

    private onRoomWidgetRoomObjectUpdateEvent(event: RoomWidgetRoomObjectUpdateEvent): void
    {
        switch(event.type)
        {
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED:
                this._selectedUsername = '';
                return;
        }
    }

    public sendChat(text: string, chatType: number, recipientName: string = '', styleId: number = 0): void
    {
        if(this._floodBlocked) return;

        if(this.messageListener) this.messageListener.processWidgetMessage(new RoomWidgetChatMessage(RoomWidgetChatMessage.MESSAGE_CHAT, text, chatType, recipientName, styleId));
    }

    public get mainWindow(): HTMLElement
    {
        return this._view.window;
    }

    public get selectedUsername(): string
    {
        return this._selectedUsername;
    }

    public get floodBlocked(): boolean
    {
        return this._floodBlocked;
    }
}