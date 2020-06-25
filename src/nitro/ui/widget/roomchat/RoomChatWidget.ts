import { IUpdateReceiver } from '../../../../core/common/IUpdateReceiver';
import { IEventDispatcher } from '../../../../core/events/IEventDispatcher';
import { RoomEnterEffect } from '../../../../room/utils/RoomEnterEffect';
import { INitroWindowManager } from '../../../window/INitroWindowManager';
import { DesktopLayoutManager } from '../../DesktopLayoutManager';
import { ChatWidgetHandler } from '../../handler/ChatWidgetHandler';
import { IRoomWidgetHandler } from '../../IRoomWidgetHandler';
import { ConversionTrackingWidget } from '../ConversionTrackingWidget';
import { RoomWidgetChatUpdateEvent } from '../events/RoomWidgetChatUpdateEvent';
import { RoomWidgetRoomViewUpdateEvent } from '../events/RoomWidgetRoomViewUpdateEvent';
import { RoomChatItem } from './RoomChatItem';

export class RoomChatWidget extends ConversionTrackingWidget implements IUpdateReceiver
{
    private _chats: RoomChatItem[];
    private _tempChats: RoomChatItem[];
    private _widgetId: number;
    private _chatItemId: number;

    private _containerWindow: HTMLElement;
    private _contentListWindow: HTMLElement;
    private _activeContentWindow: HTMLElement;

    constructor(k: IRoomWidgetHandler, windowManager: INitroWindowManager, layoutManager: DesktopLayoutManager)
    {
        super(k, windowManager, layoutManager);

        this._chats             = [];
        this._tempChats         = [];
        this._widgetId          = 0;
        this._chatItemId        = 0;

        this._containerWindow = document.createElement('div');
        this._containerWindow.className = 'nitro-widget nitro-widget-room-chat';

        this._contentListWindow = document.createElement('div');
        this._contentListWindow.className = 'room-chat-container';

        this._containerWindow.appendChild(this._contentListWindow);

        this._activeContentWindow = document.createElement('div');
        this._activeContentWindow.className = 'room-chat-list-container';

        this._contentListWindow.appendChild(this._activeContentWindow);

        PIXI.Ticker.shared.add(this.update, this);
    }

    public get mainWindow(): HTMLElement
    {
        return this._containerWindow;
    }

    public get handler(): ChatWidgetHandler
    {
        return (this.widgetHandler as ChatWidgetHandler);
    }

    public dispose(): void
    {
        if(this.disposed) return;

        PIXI.Ticker.shared.remove(this.update, this);
        
        super.dispose();
    }

    public update(k: number): void
    {
        
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;
        
        eventDispatcher.addEventListener(RoomWidgetChatUpdateEvent.RWCUE_EVENT_CHAT, this.onChatMessage.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.onRoomViewUpdate.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED, this.onRoomViewUpdate.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED, this.onRoomViewUpdate.bind(this));

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;
        
        eventDispatcher.removeEventListener(RoomWidgetChatUpdateEvent.RWCUE_EVENT_CHAT, this.onChatMessage.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.onRoomViewUpdate.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED, this.onRoomViewUpdate.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED, this.onRoomViewUpdate.bind(this));
    }

    private onChatMessage(k: RoomWidgetChatUpdateEvent): void
    {
        if(RoomEnterEffect._Str_1349() && (k.chatType !== RoomWidgetChatUpdateEvent.CHAT_TYPE_WHISPER)) return;

        const chat = new RoomChatItem(this, this.windowManager, this.getFreeItemId());

        chat._Str_13182(k);

        this.addChat(chat);
    }

    private onRoomViewUpdate(k: RoomWidgetRoomViewUpdateEvent): void
    {

    }

    private getFreeItemId(): string
    {
        return ("chat_" + this._widgetId + "_item_" + this._chatItemId);
    }

    private addChat(chat: RoomChatItem): void
    {
        if(!chat) return;

        if(chat.view)
        {
            this._activeContentWindow.appendChild(chat.view);

            chat.refreshRender();
        }

        const x         = chat.x;
        const y         = chat.y;
        const width     = chat.width;
        const height    = chat.height;

        this._chats.push(chat);

        this.setChatItemRenderable(chat);
    }

    private checkOverlappingChats(chat1: RoomChatItem, chat2: RoomChatItem): void
    {
        const x1         = chat1.x;
        const y1         = chat1.y;
        const width1     = chat1.width;
        const height1    = chat1.height;

        const x2         = chat2.x;
        const y2         = chat2.y;
        const width2     = chat2.width;
        const height2    = chat2.height;

        let totalChats = (this._chats.length - 1);

        let i = 0;
        
        while(i <= totalChats)
        {
            const existing = this._chats[i];

            if(!existing) continue;

            if(this.doOverlap(x1, y1 - height2, x1 + width1, y1 - height2 - height1, existing.x, existing.y, existing.x + existing.width, existing.y - existing.height) && y1 > existing.y)
            {
                if(this._tempChats.indexOf(existing) !== -1) continue;
                
                this._tempChats.push(existing);
                this.checkOverlappingChats(existing, chat2);
            }

            i++;
        }
    }

    private doOverlap(l1x: number, l1y: number, r1x: number, r1y: number, l2x: number, l2y: number, r2x: number, r2y: number): boolean
    {
        if(l1x > r2x || l2x > r1x) return false;

        if(l1y < r2y || l2y < r1y) return false;

        return true;
    }

    private setChatItemRenderable(item: RoomChatItem): void
    {
        if(!item) return;

        console.log(item.view);
        
        // if (k.y < -(32))
        // {
        //     if(k.view)
        //     {
        //         if(this._activeContentWindow) this._activeContentWindow.removeChild(k.view);

        //         k._Str_5574();
        //     }
        // }
        // else
        // {
            if(!item.view)
            {
                item.render();

                if(item.view && this._activeContentWindow) this._activeContentWindow.appendChild(item.view);
            }
        //}
    }
}