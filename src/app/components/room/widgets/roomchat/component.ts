import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Point } from 'pixi.js';
import { IEventDispatcher } from '../../../../../client/core/events/IEventDispatcher';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { ConversionTrackingWidget } from '../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomEnterEffect } from '../../../../../client/room/utils/RoomEnterEffect';
import { RoomWidgetChatUpdateEvent } from '../events/RoomWidgetChatUpdateEvent';
import { RoomWidgetRoomViewUpdateEvent } from '../events/RoomWidgetRoomViewUpdateEvent';
import { ChatWidgetHandler } from '../handlers/ChatWidgetHandler';
import { RoomChatItemComponent } from './chatitem/component';

@Component({
    selector: 'nitro-room-chat-component',
    template: `
    <div #chatView class="nitro-room-chat-component">
        <ng-template #chatContainer></ng-template>
    </div>`
})
export class RoomChatComponent extends ConversionTrackingWidget implements OnInit, OnDestroy
{
    private static CHAT_COUNTER: number     = 0;
    private static MAX_CHAT_HISTORY: number = 250;
    private static UPDATE_INTERVAL: number  = 4000;

    @ViewChild('chatView')
    public chatViewReference: ElementRef<HTMLDivElement>;

    @ViewChild('chatContainer', { read: ViewContainerRef })
    public chatContainer: ViewContainerRef;

    public timeoutTime: number      = 0;
    public originalScale: number    = 0;
    public scaleFactor: number      = 1;
    public cameraOffset: Point      = new Point();

    public chats: ComponentRef<RoomChatItemComponent>[]         = [];
    public tempChats: ComponentRef<RoomChatItemComponent>[]     = [];
    public pendingChats: RoomWidgetChatUpdateEvent[]            = [];
    public processingChats: boolean                             = false;

    constructor(
        private ngZone: NgZone,
        private componentFactoryResolver: ComponentFactoryResolver)
    {
        super();

        this.onChatMessage      = this.onChatMessage.bind(this);
        this.onRoomViewUpdate   = this.onRoomViewUpdate.bind(this);
    }

    public ngOnInit(): void
    {
        this.ngZone.runOutsideAngular(() => Nitro.instance.ticker.add(this.update, this));
    }

    public ngOnDestroy(): void
    {
        this.ngZone.runOutsideAngular(() => Nitro.instance.ticker.remove(this.update, this));
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;
        
        eventDispatcher.addEventListener(RoomWidgetChatUpdateEvent.RWCUE_EVENT_CHAT, this.onChatMessage);
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.onRoomViewUpdate);
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED, this.onRoomViewUpdate);
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED, this.onRoomViewUpdate);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;
        
        eventDispatcher.removeEventListener(RoomWidgetChatUpdateEvent.RWCUE_EVENT_CHAT, this.onChatMessage);
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.onRoomViewUpdate);
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED, this.onRoomViewUpdate);
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED, this.onRoomViewUpdate);
    }

    public update(time: number): void
    {
        if(Nitro.instance.time > this.timeoutTime)
        {
            if(this.timeoutTime > 0) this.moveAllChatsUp();

            this.resetTimeout();
        }
    }

    private resetTimeout(): void
    {
        this.timeoutTime = (Nitro.instance.time + RoomChatComponent.UPDATE_INTERVAL);
    }

    private onChatMessage(k: RoomWidgetChatUpdateEvent): void
    {
        if(!k || RoomEnterEffect.isRunning() && (k.chatType !== RoomWidgetChatUpdateEvent.CHAT_TYPE_WHISPER)) return;

        this.pendingChats.push(k);

        this.timeoutTime = 0;

        this.processPendingChats();
    }

    private onRoomViewUpdate(k: RoomWidgetRoomViewUpdateEvent): void
    {
        if(k.scale > 0)
        {
            if(!this.originalScale) this.originalScale = k.scale;
            else this.scaleFactor = (k.scale / this.originalScale);
        }

        if(k.positionDelta)
        {
            this.cameraOffset.x = (this.cameraOffset.x + (k.positionDelta.x / this.scaleFactor));
            this.cameraOffset.y = (this.cameraOffset.y + (k.positionDelta.y / this.scaleFactor));
        }

        this.resetAllChatLocations();
    }

    private processPendingChats(skipCheck: boolean = false): void
    {
        if(!skipCheck)
        {
            if(this.processingChats) return;
        }

        this.processingChats = true;

        const pendingChat = this.pendingChats.shift();

        if(!pendingChat)
        {
            this.resetTimeout();

            this.processingChats = false;

            return;
        }
        
        let chatRef: ComponentRef<RoomChatItemComponent>    = null;
        let chat: RoomChatItemComponent                     = null;

        this.ngZone.run(() =>
        {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(RoomChatItemComponent);

            chatRef = this.chatContainer.createComponent(componentFactory);
            chat    = chatRef.instance;

            if(!chat) return;

            chat.id = this.getFreeItemId();
            chat.update(pendingChat);
        });

        setTimeout(() => this.addChat(chatRef), 0);
    }

    private getFreeItemId(): string
    {
        return ('chat_item_' + RoomChatComponent.CHAT_COUNTER);
    }

    private addChat(chat: ComponentRef<RoomChatItemComponent>): void
    {
        if(!chat) return;

        const chatInstance = chat.instance;

        chatInstance.senderX = ((chatInstance.senderX / this.scaleFactor) - this.cameraOffset.x);

        chatInstance.setY(this.chatViewElement.offsetHeight - chatInstance.height);

        this.resetChatItemLocation(chat);
        this.makeRoomForChat(chat);

        this.chats.push(chat);

        chatInstance.ready();

        RoomChatComponent.CHAT_COUNTER++;

        setTimeout(() => this.processPendingChats(true), 0);
    }

    private hideChat(chat: ComponentRef<RoomChatItemComponent>): void
    {
        if(!chat) return;

        const chatIndex = this.chats.indexOf(chat);

        if(chatIndex >= 0) this.chats.splice(chatIndex, 1);

        const chatContainerIndex = this.chatContainer.indexOf(chat.hostView);

        if(chatContainerIndex >= 0) this.chatContainer.remove(chatContainerIndex);
    }

    private moveChatUp(chat: ComponentRef<RoomChatItemComponent>, nextHeight: number = 0): void
    {
        if(!chat) return;

        const chatInstance = chat.instance;

        let y = chatInstance.height;

        if(nextHeight) y = nextHeight;

        chatInstance.setY((chatInstance.getY() - y));

        if(chatInstance.getY() < (-(chatInstance.height * 2))) this.hideChat(chat);
    }

    private moveAllChatsUp(): void
    {
        let i = (this.chats.length - 1);

        while(i >= 0)
        {
            this.moveChatUp(this.chats[i], 15);

            i--;
        }
    }

    private makeRoomForChat(chat: ComponentRef<RoomChatItemComponent>): void
    {
        if(!chat) return;

        const chatInstance = chat.instance;

        const lastChat          = this.chats[this.chats.length - 1];
        const lastChatInstance  = (lastChat && lastChat.instance);

        if(!lastChatInstance) return;

        const lowestPoint   = ((lastChatInstance.getY() + lastChatInstance.height) - 1);
        const highestPoint  = chatInstance.getY();
        const requiredSpace = (chatInstance.height + 1);

        const spaceAvailable = (this.chatViewElement.offsetHeight - lowestPoint);

        if(spaceAvailable < requiredSpace)
        {
            for(const chat of this.chats)
            {
                this.moveChatUp(chat, (requiredSpace - spaceAvailable));
            }
        }
    }

    private resetAllChatLocations(): void
    {
        let i = (this.chats.length - 1);

        while(i >= 0)
        {
            const chat = this.chats[i];

            if(chat) this.resetChatItemLocation(chat);

            i--;
        }
    }

    private resetChatItemLocation(chat: ComponentRef<RoomChatItemComponent>): void
    {
        const chatInstance = chat.instance;

        let x = ((chatInstance.senderX + this.cameraOffset.x) * this.scaleFactor);

        x = (x - (chatInstance.width / 2));
        x = (x + (this.chatViewElement.offsetWidth / 2));

        chatInstance.setX(x);
    }

    public get chatViewElement(): HTMLDivElement
    {
        return ((this.chatViewReference && this.chatViewReference.nativeElement) || null);
    }

    public get handler(): ChatWidgetHandler
    {
        return (this.widgetHandler as ChatWidgetHandler);
    }
}