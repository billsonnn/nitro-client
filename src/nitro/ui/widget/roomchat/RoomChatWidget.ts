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

    private static _Str_3729: number = 19;
    private static _Str_18120: number = 10;
    private static _Str_12991: number = 20;
    private static _Str_11054: number = 32;
    private static _Str_16411: number = 25;
    private static _Str_13238: number = 4000;
    private static _Str_17591: number = 6000;
    private static _Str_17318: number = 3;
    private static _Str_17488: number = 1;
    private static _Str_16314: number = 8;
    private static _Str_15627: number = 10;
    private static _Str_11205: number = 12;
    private static _Str_6970: number = 0;
    private static _Str_17792: number = (((RoomChatWidget._Str_16314 + RoomChatWidget._Str_6970) * RoomChatWidget._Str_3729) + RoomChatWidget._Str_3729);
    private static _Str_18733: number = (((RoomChatWidget._Str_15627 + RoomChatWidget._Str_6970) * RoomChatWidget._Str_3729) + RoomChatWidget._Str_3729);
    private static _Str_17276: number = (((RoomChatWidget._Str_11205 + RoomChatWidget._Str_6970) * RoomChatWidget._Str_3729) + RoomChatWidget._Str_3729);
    private static _Str_6383: number = 23;
    private static _Str_18228: number = 40;
    private static _Str_6198: number = 1;
    private static _Str_17685: number = 750;
    private static _Str_16222: number = 1000;

    private _Str_10568: number = 0;
    private _Str_8808: number = 0;
    private _Str_2496: HTMLElement;
    private _Str_4396: HTMLElement;
    private _Str_3454: HTMLElement;
    private _Str_2338: RoomChatItem[];
    private _Str_3107: RoomChatItem[];
    private _Str_4125: RoomChatItem[];
    private _Str_11471: number;
    private _Str_20565: number = 0;
    private _Str_7136: number = 1;
    private _Str_4567: string;
    private _Str_7184: number = 1;
    private _Str_16304: number = 0;
    private _Str_7165: PIXI.Point;
    private _Str_2701: any;
    private _Str_1222: boolean = false;
    private _Str_17185: boolean = false;
    private _Str_19219: number = 150;
    private _Str_3991: number;
    private _Str_9513: number = 19;
    private _Str_24033: number = 100;
    private _Str_25154: number = 205;
    private _Str_8959: number;
    private _Str_11243: number;

    constructor(handler: IRoomWidgetHandler, windowManager: INitroWindowManager, layoutManager: DesktopLayoutManager)
    {
        super(handler, windowManager, layoutManager);

        this._view = new RoomChatView(this);

        this._Str_2496 = this._view.window;
        this._Str_3454 = this._view.chatsContainer;


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
        const _local_2 = event.roomViewRectangle;

        if(event.scale > 0)
        {
            if(this._Str_16304 === 0)
            {
                this._Str_16304 = event.scale;
            }
            else
            {
                this._Str_7184 = (event.scale / this._Str_16304);
            }
        }

        if(event.positionDelta != null)
        {
            this._Str_7165.x = (this._Str_7165.x + (event.positionDelta.x / this._Str_7184));
            this._Str_7165.y = (this._Str_7165.y + (event.positionDelta.y / this._Str_7184));
        }

        if(event.roomViewRectangle != null)
        {
            if(this._Str_2701 == null) return;

            this._Str_2496.style.width    = _local_2.width + 'px';
            this._Str_2496.style.height   = (this._Str_3991 + this._Str_2701._Str_22103) + 'px';
            this._Str_4396.style.width    = (this._Str_2496.clientWidth - this._Str_2701._Str_10683) + 'px';
            this._Str_4396.style.height   = this._Str_3991 + 'px';
            this._Str_4396.style.left     = this._Str_2496.clientLeft + 'px';
            this._Str_4396.style.right    = this._Str_2496.clientTop + 'px';
            this._Str_3454.style.width    = (this._Str_2496.clientWidth - this._Str_2701._Str_10683) + 'px';
            this._Str_3454.style.height   = this._Str_3991 + 'px';

            if (this._Str_3910())
            {
                this._Str_20247();
            }

            this._Str_2701._Str_8958(this._Str_2496.getBoundingClientRect(), true);
        }

        this._Str_12615();
    }

    public update(time: number): void
    {
        
    }

    private addChatItem(chat: RoomChatItem): void
    {
        if(this._Str_7184 !== 1)
        {
            chat._Str_7368 = (chat._Str_7368 / this._Str_7184);
        }

        chat._Str_7368 = (chat._Str_7368 - this._Str_7165.x);

        this._Str_14645(chat);
        this._Str_3107.push(chat);

        //this._Str_19076();

        // if(!chat || !this._view) return;

        // const chatContainer = this._view.chatsContainer;

        // if(!chatContainer) return;

        // chatContainer.appendChild(chat.view)
    }

    // private _Str_19076():void
    // {
    //     if(this._Str_1222) return;

    //     if(!this._Str_3107.length) return;

    //     while (((this._Str_3107.length > RoomChatWidget._Str_17488) || ((this._Str_3910()) && (this._Str_3107.length > 0))))
    //     {
    //         this._Str_20317();
    //     }

    //     var k: boolean;
    //     if (this._Str_2338.length == 0)
    //     {
    //         k = true;
    //     }
    //     else
    //     {
    //         k = this._Str_16477(this._Str_3107[0]);
    //     }
    //     if (k)
    //     {
    //         this._Str_20317();
    //         this._Str_10568 = (getTimer() + _Str_13238);
    //     }
    //     else
    //     {
    //         if (((this._Str_2338.length > 0) && (this._Str_3107.length > 0)))
    //         {
    //             this._Str_9513 = this._Str_9323(this._Str_2338[(this._Str_2338.length - 1)], this._Str_3107[0]);
    //         }
    //         else
    //         {
    //             this._Str_9513 = _Str_3729;
    //         }
    //         this._Str_22131();
    //     }
    // }

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
        // var k: number = (this._Str_2496.bottom - RoomChatHistoryPulldown._Str_3788);
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

    private _Str_3910(): boolean
    {
        return (this._Str_2701 == null) ? false : this._Str_2701.active;
    }

    private _Str_17277(): boolean
    {
        return (this._Str_2701 == null) ? false : this._Str_2701.visible;
    }

    public _Str_20247(): void
    {
        if (this._Str_3910())
        {
            this._Str_3454.style.height = (this._Str_17890() + RoomChatWidget._Str_6383) + 'px';
            this._Str_12615();
        }
    }

    public _Str_17890(): number
    {
        let _local_2 = 0;
        let _local_3 = 0;

        while(_local_3 < this._Str_2338.length)
        {
            const k = this._Str_2338[_local_3];

            if(k)
            {
                if(!_local_3)
                {
                    _local_2 = (_local_2 + RoomChatWidget._Str_3729);
                }
                else
                {
                    _local_2 = (_local_2 + this._Str_9323(this._Str_2338[(_local_3 - 1)], k));
                }

                _local_2 = (_local_2 + ((k.aboveLevels - 1) * RoomChatWidget._Str_3729));
            }

            _local_3++;
        }

        return _local_2;
    }

    public _Str_12615():void
    {
        if(!this._Str_2701) return;

        let k = (this._Str_2338.length - 1);

        while(k >= 0)
        {
            const _local_2 = this._Str_2338[k];

            if(_local_2)
            {
                this._Str_14645(_local_2);
                this._Str_19662(_local_2);
            }

            k--;
        }

        k = 0;

        while (k < this._Str_2338.length)
        {
            const _local_2 = this._Str_2338[k];

            if(_local_2)
            {
                this._Str_19620(_local_2);
            }

            k++;
        }

        k = 0;

        while (k < this._Str_3107.length)
        {
            const _local_2 = this._Str_3107[k];
            
            if(_local_2)
            {
                this._Str_14645(_local_2);
            }

            k++;
        }
    }

    private _Str_14645(k:RoomChatItem): void
    {
        if(!k || !this._Str_2701) return;

        const _local_2 = ((k._Str_7368 + this._Str_7165.x) * this._Str_7184);
        const _local_3 = (_local_2 - (k.width / 2));
        const _local_4 = (_local_3 + k.width);
        const _local_5 = (((-(this._Str_2496.clientWidth) / 2) - RoomChatWidget._Str_12991) + this._Str_24033);
        const _local_6 = ((((this._Str_2496.clientWidth / 2) + RoomChatWidget._Str_12991) - this._Str_2701._Str_10683) - this._Str_25154);
        const _local_7 = ((_local_3 >= _local_5) && (_local_3 <= _local_6));
        const _local_8 = ((_local_4 >= _local_5) && (_local_4 <= _local_6));

        let _local_9 = 0;
        let _local_10 = 0;

        if (((_local_7) && (_local_8)))
        {
            _local_9 = _local_3;
            _local_10 = _local_9;
        }
        else
        {
            if(_local_2 >= 0)
            {
                _local_9 = (_local_6 - k.width);
            }
            else
            {
                _local_9 = _local_5;
            }
        }

        k.x = ((_local_9 + (this._Str_2496.clientWidth / 2)) + this._Str_2496.clientLeft);

        if(((_local_2 < _local_5) || (_local_2 > _local_6)))
        {
            k._Str_22279();
        }
        else
        {
            k._Str_23410((_local_3 - _local_9));
        }
    }

    private _Str_19662(k:RoomChatItem): void
    {
        if(!k) return;
        
        const _local_2 = this._Str_2338.indexOf(k);
        const _local_3 = ((this._Str_3910()) ? 0 : this._Str_7136);

        if(_local_2 === (this._Str_2338.length - 1))
        {
            k.y = ((this._Str_23166() - ((_local_3 + 1) * RoomChatWidget._Str_3729)) - RoomChatWidget._Str_6383);
        }
        else
        {
            const _local_4 = this._Str_2338[(_local_2 + 1)].aboveLevels;

            if(_local_4 < 2)
            {
                k.y = (this._Str_2338[(_local_2 + 1)].y - this._Str_9323(k, this._Str_2338[(_local_2 + 1)]));
            }
            else
            {
                k.y = (this._Str_2338[(_local_2 + 1)].y - (_local_4 * RoomChatWidget._Str_3729));
            }
        }
    }

    private _Str_23166(): number
    {
        if(this._Str_3910())
        {
            return this._Str_3454.clientHeight;
        }

        return this._Str_3991 + this._Str_2496.clientTop;
    }

    private _Str_9323(k: RoomChatItem, _arg_2: RoomChatItem): number
    {
        let _local_3 = 0; // chat bubble factory _Str_24902

        if(k._Str_23373(_local_3, _arg_2.x, k.y, _arg_2.width, _arg_2.height)) return RoomChatWidget._Str_3729;

        return RoomChatWidget._Str_18120;
    }

    private _Str_19620(k: RoomChatItem): void
    {
        if(!k) return;
        
        if (k.y < -(RoomChatWidget._Str_11054))
        {
            if (k.view != null)
            {
                this._Str_3454.removeChild(k.view);

                k._Str_5574();
            }
        }
        else
        {
            if(!k.view)
            {
                k._Str_13126();

                if(k.view) this._Str_3454.appendChild(k.view);
            }
        }
    }
}