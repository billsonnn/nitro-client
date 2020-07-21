import { INitroWindowManager } from '../../../window/INitroWindowManager';
import { MouseEventType } from '../../MouseEventType';
import { SystemChatStyleEnum } from '../enums/SystemChatStyleEnum';
import { RoomWidgetChatUpdateEvent } from '../events/RoomWidgetChatUpdateEvent';
import { RoomChatWidget } from './RoomChatWidget';

export class RoomChatItem 
{
    private _widget: RoomChatWidget;
    private _windowManager: INitroWindowManager;
    private _window: HTMLElement;
    private _id: string;
    private _chatType: number;
    private _chatStyle: number;
    private _senderId: number;
    private _senderName: string;
    private _message: string;
    private _messageLinks: string[];
    private _timeStamp: number;
    private _senderX: number;
    private _senderImage: HTMLImageElement;
    private _senderColor: number;
    private _roomId: number;
    private _userType: number;
    private _petType: number;
    private _senderCategory: number;
    private _x: number = 0;
    private _y: number = 0;
    private _width: number = 0;
    private _height: number = 0;
    private _rendered: boolean = false;

    constructor(widget: RoomChatWidget, windowManager: INitroWindowManager, id: string)
    {
        this._widget        = widget;
        this._windowManager = windowManager;
        this._id            = id;

        this._senderName    = '';
        this._message       = '';
    }

    public dispose(): void
    {
        if (this._window != null)
        {
            this._window.remove();
            this._window = null;
            this._widget = null;
            this._windowManager = null;
            this._senderImage = null;
        }
    }

    public _Str_13182(k: RoomWidgetChatUpdateEvent): void
    {
        this._chatType = k.chatType;
        this._chatStyle = k.styleId;
        this._senderId = k.userId;
        this._senderName = k.userName;
        this._senderCategory = k.userCategory;
        this._message = k.text;
        this._messageLinks = k.links;
        this._senderX = k.userX;
        this._senderImage = k.userImage;
        this._senderColor = k.userColor;
        this._roomId = k.roomId;
        this._userType = k.userType;
        this._petType = k.petType;

        this.render();
    }

    public set message(k: string)
    {
        this._message = k;
    }

    public set senderName(k: string)
    {
        this._senderName = k;
    }

    public set _Str_25766(k: HTMLImageElement)
    {
        this._senderImage = k;
    }

    public set _Str_23108(k: number)
    {
        this._senderColor = k;
    }

    public set _Str_3214(k: number)
    {
        this._chatType = k;
    }

    public get view(): HTMLElement
    {
        return this._window;
    }

    public get timeStamp(): number
    {
        return this._timeStamp;
    }

    public get senderX(): number
    {
        return this._senderX;
    }

    public set senderX(k: number)
    {
        this._senderX = k;
    }

    public get width(): number
    {
        return this._width;
    }

    public get height(): number
    {
        return this._height;
    }

    public get message(): string
    {
        return this._message;
    }

    public get x(): number
    {
        return this._x;
    }

    public get y(): number
    {
        return this._y;
    }

    public set timeStamp(k: number)
    {
        this._timeStamp = k;
    }

    public set x(k: number)
    {
        this._x = k;

        if(this._window) this._window.style.left = (k + 'px');
    }

    public set y(k: number)
    {
        this._y = k;

        if(this._window) this._window.style.top = (k + 'px');
    }

    public hidePointer(): void
    {
        if(!this._window) return;
        
        const element = (this._window.getElementsByClassName('chat-pointer')[0] as HTMLElement);

        if(!element) return;

        element.style.visibility = 'hidden';
    }

    public _Str_23410(k: number): void
    {
        if(!this._window) return;

        const pointer   = (this._window.getElementsByClassName('chat-pointer')[0] as HTMLElement);
        const middle    = (this._window.getElementsByClassName('chat-middle')[0] as HTMLElement);

        if(!pointer || !middle) return;

        pointer.style.visibility = 'visible';

        const rectangle = middle.getBoundingClientRect();

        k = (k + (this._window.clientWidth / 2));
        k = Math.min(k, (rectangle.right - pointer.clientWidth));
        k = Math.max(k, rectangle.left);

        pointer.style.left = `${ k }px`;
    }

    public _Str_5574(): void
    {
        if (this._window)
        {
            this._window.remove();
        }
        this._window = null;
        this._rendered = false;
    }

    private get _Str_21943(): boolean
    {
        return (this._chatStyle === SystemChatStyleEnum.GENERIC);
    }

    public render(): void
    {
        const view = {
            username: this._senderName,
            message: this._message,
            styleId: this._chatStyle,
            chatType: this._chatType
        };

        this._window = this._widget.windowManager.renderElement(this.getTemplate(), view);

        this._window.style.visibility = 'hidden';
    }

    public refreshRender(): void
    {
        this._Str_23110(this._window);

        let yOffset = 0;
        
        const chatLeft = (this._window.getElementsByClassName('chat-left')[0] as HTMLElement);

        if(chatLeft)
        {
            const imageArea = (this._window.getElementsByClassName('user-image')[0] as HTMLElement);

            if(imageArea && this._senderImage) imageArea.appendChild(this._senderImage.cloneNode());

            const color = (+this._senderColor || 16777215);

            chatLeft.style.backgroundColor = ('#' + color.toString(16));
        }

        const pointerChatPiece = (this._window.getElementsByClassName('chat-pointer')[0] as HTMLElement);

        if(pointerChatPiece)
        {
            pointerChatPiece.style.left = (this.width / 2) + 'px';

            yOffset = pointerChatPiece.offsetHeight;
        }

        const bounds = this._window.getBoundingClientRect();

        this._x         = bounds.x;
        this._y         = bounds.y;
        this._width     = this._window.offsetWidth;
        this._height    = this._window.offsetHeight; // (this._window.offsetHeight - yOffset);

        this._window.style.visibility = 'visible';
    }

    private _Str_23110(k: HTMLElement): void
    {
        k.addEventListener(MouseEventType.MOUSE_CLICK, this._Str_24326.bind(this));
        k.addEventListener(MouseEventType.MOUSE_DOWN, this._Str_22405.bind(this));
        k.addEventListener(MouseEventType.ROLL_OVER, this._Str_23850.bind(this));
        k.addEventListener(MouseEventType.ROLL_OUT, this._Str_23475.bind(this));
        k.addEventListener(MouseEventType.MOUSE_UP, this._Str_24323.bind(this));
    }

    private _Str_24326(k: MouseEvent): void
    {
        //this._widget.onItemMouseClick(this._senderId, this._senderName, this._senderCategory, this._roomId, k);
    }

    private _Str_22405(k: MouseEvent): void
    {
        //this._widget.onItemMouseDown(this._senderId, this._senderCategory, this._roomId, k);
    }

    private _Str_23850(k: MouseEvent): void
    {
        //his._widget.onItemMouseOver(this._senderId, this._senderCategory, this._roomId, k);
    }

    private _Str_23475(k: MouseEvent): void
    {
        //this._widget.onItemMouseOut(this._senderId, this._senderCategory, this._roomId, k);
    }

    private _Str_24323(k: MouseEvent): void
    {
        //this._widget.mouseUp();
    }

    private getTemplate(): string
    {
        return `
        <div class="chat-item chat-style-{{ styleId }} chat-type-{{ chatType }}">
            <div class="chat-left">
                <div class="user-image"></div>
                <div class="user-pointer"></div>
            </div>
            <div class="chat-right">
                <b>{{ username }}:</b> {{ message }}
            </div>
            <div class="chat-pointer"></div>
        </div>`;
    }

    public get chatStyle(): number
    {
        return this._chatStyle;
    }
}