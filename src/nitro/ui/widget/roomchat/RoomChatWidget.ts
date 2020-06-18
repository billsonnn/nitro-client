import { IUpdateReceiver } from '../../../../core/common/IUpdateReceiver';
import { IEventDispatcher } from '../../../../core/events/IEventDispatcher';
import { RoomEnterEffect } from '../../../../room/utils/RoomEnterEffect';
import { INitroWindowManager } from '../../../window/INitroWindowManager';
import { DesktopLayoutManager } from '../../DesktopLayoutManager';
import { IRoomWidgetHandler } from '../../IRoomWidgetHandler';
import { ConversionTrackingWidget } from '../ConversionTrackingWidget';
import { RoomWidgetChatUpdateEvent } from '../events/RoomWidgetChatUpdateEvent';
import { RoomWidgetRoomViewUpdateEvent } from '../events/RoomWidgetRoomViewUpdateEvent';
import { RoomWidgetChatSelectAvatarMessage } from '../messages/RoomWidgetChatSelectAvatarMessage';
import { RoomWidgetRoomObjectMessage } from '../messages/RoomWidgetRoomObjectMessage';
import { RoomChatItem } from './RoomChatItem';
import { RoomChatView } from './RoomChatView';

export class RoomChatWidget extends ConversionTrackingWidget implements IUpdateReceiver
{
    private _view: RoomChatView;

    constructor(handler: IRoomWidgetHandler, windowManager: INitroWindowManager, layoutManager: DesktopLayoutManager)
    {
        super(handler, windowManager, layoutManager);

        this._view = new RoomChatView(this);

        PIXI.Ticker.shared.add(this.update, this);
    }

    public dispose(): void
    {
        PIXI.Ticker.shared.remove(this.update, this);

        if(this._view)
        {
            this._view.dispose();

            this._view = null;
        }
        
        super.dispose();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetChatUpdateEvent.RWCUE_EVENT_CHAT, this.onRoomWidgetChatUpdateEvent.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.onRoomWidgetRoomViewUpdateEvent.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED, this.onRoomWidgetRoomViewUpdateEvent.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED, this.onRoomWidgetRoomViewUpdateEvent.bind(this));

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetChatUpdateEvent.RWCUE_EVENT_CHAT, this.onRoomWidgetChatUpdateEvent.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.onRoomWidgetRoomViewUpdateEvent.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED, this.onRoomWidgetRoomViewUpdateEvent.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED, this.onRoomWidgetRoomViewUpdateEvent.bind(this));
    }

    private onRoomWidgetChatUpdateEvent(event: RoomWidgetChatUpdateEvent): void
    {
        if((RoomEnterEffect._Str_1349() && (event.chatType !== RoomWidgetChatUpdateEvent.CHAT_TYPE_SPEAK))) return;

        const chatItem = new RoomChatItem(this, this._windowManager, null);

        chatItem._Str_13182(event);

        this.addChatItem(chatItem);
    }

    private onRoomWidgetRoomViewUpdateEvent(event: RoomWidgetRoomViewUpdateEvent): void
    {
        switch(event.type)
        {
            case RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED:
                return;
            case RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED:
                return;
            case RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED:
                return;
        }
    }

    public update(time: number): void
    {
        
    }

    private addChatItem(chat: RoomChatItem): void
    {
        if(!chat || !this._view) return;

        const chatContainer = this._view.chatsContainer;

        if(!chatContainer) return;

        chatContainer.appendChild(chat.view);
    }

    public _Str_24206(k: number, _arg_2: number, _arg_3: number, _arg_4: MouseEvent):void
    {
        // if (this._Str_17277())
        // {
        //     return;
        // }
        // if (this._Str_2701 != null)
        // {
        //     this._Str_2701._Str_19757(_arg_4.stageY, true);
        // }
    }

    public _Str_22868(k: number, _arg_2: number, _arg_3: number, _arg_4: MouseEvent):void
    {
    }

    public _Str_25858(k: number, _arg_2: number, _arg_3: number, _arg_4: MouseEvent):void
    {
    }

    public _Str_12979(k: MouseEvent):void
    {
        // if (this._Str_2701 != null)
        // {
        //     this._Str_2701._Str_19757(k.stageY, true);
        // }
    }

    public _Str_24607(k: MouseEvent):void
    {
        // if (this._Str_2701 != null)
        // {
        //     this._Str_2701._Str_7189();
        // }
    }

    public _Str_20437():void
    {
        // this._Str_4396._Str_13999();
        // var k:Number = (this._Str_2496.bottom - RoomChatHistoryPulldown._Str_3788);
        // if (k < this._Str_8959)
        // {
        //     if (k <= (this._Str_3991 + this._Str_2496.y))
        //     {
        //         if (this._Str_3910())
        //         {
        //             this._Str_7189();
        //         }
        //         this._Str_8599();
        //         return;
        //     }
        // }
        // if (((this._Str_17185) && (!(this._Str_3910()))))
        // {
        //     this._Str_8599();
        //     this._Str_17185 = false;
        // }
    }

    public _Str_22991(k: number, _arg_2: string, _arg_3: number, _arg_4: number, _arg_5: MouseEvent):void
    {
        if(_arg_5.shiftKey)
        {
            // if (this._Str_2701 != null)
            // {
            //     this._Str_2701._Str_24994();
            // }

            return;
        }
        
        this.messageListener.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_INFO, k, _arg_3));
        this.messageListener.processWidgetMessage(new RoomWidgetChatSelectAvatarMessage(RoomWidgetChatSelectAvatarMessage.MESSAGE_SELECT_AVATAR, k, _arg_2, _arg_4));
    }

    public get mainWindow(): HTMLElement
    {
        return this._view.window;
    }
}