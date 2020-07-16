import { IUpdateReceiver } from '../../../../core/common/IUpdateReceiver';
import { IEventDispatcher } from '../../../../core/events/IEventDispatcher';
import { RoomEnterEffect } from '../../../../room/utils/RoomEnterEffect';
import { Nitro } from '../../../Nitro';
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
    private static CHAT_COUNTER: number     = 0;
    private static MAX_CHAT_HISTORY: number = 250;
    private static UPDATE_INTERVAL: number  = 4000;

    private _timeoutTime: number;

    private _chats: RoomChatItem[];
    private _tempChats: RoomChatItem[];
    private _oldChats: RoomChatItem[];

    private _containerWindow: HTMLElement;
    private _contentListWindow: HTMLElement;
    private _activeContentWindow: HTMLElement;

    private _originalScale: number;
    private _scaleFactor: number;
    private _cameraOffset: PIXI.Point;

    constructor(k: IRoomWidgetHandler, windowManager: INitroWindowManager, layoutManager: DesktopLayoutManager)
    {
        super(k, windowManager, layoutManager);

        this._timeoutTime       = 0;

        this._chats             = [];
        this._tempChats         = [];
        this._oldChats          = [];

        this._originalScale     = 1;
        this._scaleFactor       = 0;
        this._cameraOffset      = new PIXI.Point();

        this._containerWindow = document.createElement('div');
        this._containerWindow.className = 'nitro-widget nitro-widget-room-chat';

        this._contentListWindow = document.createElement('div');
        this._contentListWindow.className = 'room-chat-container';

        this._containerWindow.appendChild(this._contentListWindow);

        this._activeContentWindow = document.createElement('div');
        this._activeContentWindow.className = 'room-chat-list-container';
        this._activeContentWindow

        this._contentListWindow.appendChild(this._activeContentWindow);

        Nitro.instance.ticker.add(this.update, this);
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

        Nitro.instance.ticker.remove(this.update, this);
        
        super.dispose();
    }

    public update(time: number): void
    {
        if(Nitro.instance.time > this._timeoutTime)
        {
            if(this._timeoutTime > 0)
            {
                this.moveAllChatsUp();
            }

            this.resetTimeout();
        }
    }

    private resetTimeout(): void
    {
        this._timeoutTime = (Nitro.instance.time + RoomChatWidget.UPDATE_INTERVAL);
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
        if(k.scale > 0)
        {
            if(!this._originalScale) this._originalScale = k.scale;
            else this._scaleFactor = (k.scale / this._originalScale);
        }

        if(k.positionDelta)
        {
            this._cameraOffset.x = (this._cameraOffset.x + (k.positionDelta.x / this._scaleFactor));
            this._cameraOffset.y = (this._cameraOffset.y + (k.positionDelta.y / this._scaleFactor));
        }

        if(k.roomViewRectangle)
        {
            const rectangle = k.roomViewRectangle;

            this._containerWindow.style.width       = (rectangle.width + 'px');
            this._containerWindow.style.height      = '270px';

            this._contentListWindow.style.width     = (this._containerWindow.offsetWidth + 'px');
            this._contentListWindow.style.height    = '270px';

            this._activeContentWindow.style.width   = (this._containerWindow.offsetWidth + 'px');
            this._activeContentWindow.style.height  = '270px';
        }

        this.resetAllChatLocations();
    }

    private getFreeItemId(): string
    {
        return ("chat_item_" + RoomChatWidget.CHAT_COUNTER);
    }

    private addChat(chat: RoomChatItem): void
    {
        if(!chat) return;

        if(chat.view)
        {
            this._activeContentWindow.appendChild(chat.view);

            chat.refreshRender();
        }

        if(this._scaleFactor !== 1) chat.senderX = (chat.senderX / this._scaleFactor);

        chat.senderX = (chat.senderX - this._cameraOffset.x);
        chat.y = ((this._activeContentWindow.offsetHeight) - (chat.height / 2));

        this.resetChatItemLocation(chat);
        this.makeRoomForChat(chat);
        this.resetTimeout();

        this._chats.push(chat);

        RoomChatWidget.CHAT_COUNTER++;
    }

    private resetAllChatLocations(): void
    {
        let i = (this._chats.length - 1);

        while(i >= 0)
        {
            const chat = this._chats[i];

            if(chat)
            {
                this.resetChatItemLocation(chat);
            }

            i--;
        }
    }

    private moveChatUp(chat: RoomChatItem, nextHeight: number = 0): void
    {
        if(!chat) return;

        if(nextHeight) chat.y = ((chat.y - nextHeight) - 1);
        else chat.y = ((chat.y - chat.height) - 1);

        if(chat.y < (-(chat.height * 2))) this.hideChat(chat);
    }

    private hideChat(chat: RoomChatItem): void
    {
        if(!chat) return;

        const index = this._chats.indexOf(chat);

        if(index === -1) return;

        this._chats.splice(index, 1);

        if(chat.view.parentElement) chat.view.parentElement.removeChild(chat.view);

        this._oldChats.push(chat);

        const toDelete = (RoomChatWidget.MAX_CHAT_HISTORY - this._oldChats.length);

        if(toDelete > 0) this._oldChats.splice(0, toDelete);
    }

    private moveAllChatsUp(): void
    {
        let i = (this._chats.length - 1);

        while(i >= 0)
        {
            const chat = this._chats[i];

            let nextHeight = 0;

            if(this._chats[i - 1]) nextHeight = this._chats[i - 1].height;

            chat && this.moveChatUp(chat, nextHeight);

            i--;
        }
    }

    private makeRoomForChat(chat: RoomChatItem): void
    {
        let i = 0;

        while(i < this._chats.length)
        {
            const existing = this._chats[i];

            if(chat)
            {
                if(this.doOverlap(chat.x, chat.y, (chat.x + chat.width), (chat.y - chat.height), existing.x, existing.y, (existing.x + existing.width), (existing.y - existing.height)))
                {
                    this._tempChats.push(existing);

                    this.checkOverlappingChats(existing, chat);
                }
            }

            i++;
        }

        i = 0;

        while(i < this._tempChats.length)
        {
            const chat = this._tempChats[i];

            if(chat)
            {
                let nextHeight = 0;

                if(this._tempChats[i + 1]) nextHeight = this._tempChats[i + 1].height;

                this.moveChatUp(chat, nextHeight);
            }

            i++;
        }

        this._tempChats = [];
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

        for(let existingChat of this._chats)
        {
            if(!existingChat) continue;

            if(this.doOverlap(x1, (y1 - height2), (x1 + width1), (y1 - height2 - height1), existingChat.x, existingChat.y, (existingChat.x + existingChat.width), (existingChat.y - existingChat.height)) && y1 > existingChat.y)
            {
                if(this._tempChats.indexOf(existingChat) !== -1) continue;
                
                this._tempChats.push(existingChat);

                this.checkOverlappingChats(existingChat, chat2);
            }
        }
    }

    private doOverlap(l1x: number, l1y: number, r1x: number, r1y: number, l2x: number, l2y: number, r2x: number, r2y: number): boolean
    {
        if(l1x > r2x || l2x > r1x) return false;

        if(l1y < r2y || l2y < r1y) return false;

        return true;
    }

    private resetChatItemLocation(chat: RoomChatItem): void
    {
        let x = ((chat.senderX + this._cameraOffset.x) * this._scaleFactor);

        x = (x - (chat.width / 2));
        x = (x + (this._activeContentWindow.offsetWidth / 2));

        chat.x = x;
    }
}