import { INitroWindowManager } from '../../../window/INitroWindowManager';
import { MouseEventType } from '../../MouseEventType';
import { SystemChatStyleEnum } from '../enums/SystemChatStyleEnum';
import { RoomWidgetChatUpdateEvent } from '../events/RoomWidgetChatUpdateEvent';
import { RoomChatWidget } from './RoomChatWidget';

export class RoomChatItem 
{
    public static _Str_15992: number = 18;
    private static _Str_9962: number = 6;
    private static _Str_15961: number = 6;
    private static _Str_5706: number = 35;
    private static _Str_13391: number = 26;
    private static NAME: string = "name";
    private static MESSAGE: string = "message";
    private static POINTER: string = "pointer";
    private static BACKGROUND: string = "background";
    private static _Str_17786: string = "${chat.history.drag.tooltip}";

    private _widget: RoomChatWidget;
    private _windowManager: INitroWindowManager;
    private _window: HTMLElement;
    private _id: string;
    private _siteUrl: string;
    private _aboveLevels: number = 0;
    private _screenLevel: number = -1;
    private _chatType: number;
    private _chatStyle: number;
    private _senderId: number;
    private _senderName: string;
    private _message: string;
    private _messageLinks: string[];
    private _timeStamp: number;
    private _senderX: number;
    private _senderImage: PIXI.Texture;
    private _senderColor: number;
    private _roomId: number;
    private _userType: number;
    private _petType: number;
    private _senderCategory: number;
    private _width: number = 0;
    private _rendered: boolean = false;
    private _topOffset: number = 0;
    private _originalBackgroundYOffset: number = 0;
    private _x: number = 0;
    private _y: number = 0;
    private _dragTooltipEnabled: boolean = false;

    constructor(widget: RoomChatWidget, windowManager: INitroWindowManager, id: string)
    {
        this._widget = widget;
        this._windowManager = windowManager;
        this._id = id;
        this._siteUrl = null;

        this._senderName = '';
        this._message = '';
    }

    public dispose(): void
    {
        if (this._window != null)
        {
            //this._window.dispose();
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

        this._Str_13126();
    }

    public set message(k: string)
    {
        this._message = k;
    }

    public set senderName(k: string)
    {
        this._senderName = k;
    }

    public set _Str_25766(k: PIXI.Texture)
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

    public get screenLevel(): number
    {
        return this._screenLevel;
    }

    public get timeStamp(): number
    {
        return this._timeStamp;
    }

    public get _Str_7368(): number
    {
        return this._senderX;
    }

    public set _Str_7368(k: number)
    {
        this._senderX = k;
    }

    public get width(): number
    {
        return this._width;
    }

    public get height(): number
    {
        return RoomChatItem._Str_15992;
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

    public get aboveLevels(): number
    {
        return this._aboveLevels;
    }

    public set aboveLevels(k: number)
    {
        this._aboveLevels = k;
    }

    public set screenLevel(k: number)
    {
        this._screenLevel = k;
    }

    public set timeStamp(k: number)
    {
        this._timeStamp = k;
    }

    public set x(k: number)
    {
        this._x = k;

        if(this._window) this._window.style.left = `${ k }px`;
    }

    public set y(k: number)
    {
        this._y = k;

        if(this._window) this._window.style.top = `${ ((k - this._topOffset) + this._originalBackgroundYOffset) }px`;
    }

    public _Str_22279(): void
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

    public _Str_23373(k: number, _arg_2: number, _arg_3: number, _arg_4: number, _arg_5: number): boolean
    {
        // var _local_6:Rectangle = new Rectangle(this._x, this._y, this.width, k);
        // var _local_7:Rectangle = new Rectangle(_arg_2, _arg_3, _arg_4, _arg_5);
        // return _local_6.intersects(_local_7);
        return false;
    }

    public _Str_5574(): void
    {
        if (this._window)
        {
            //this._window.dispose();
        }
        this._window = null;
        this._rendered = false;
    }

    private get _Str_21943(): boolean
    {
        return (this._chatStyle === SystemChatStyleEnum.GENERIC);
    }

    public _Str_13126(): void
    {
        const view = {
            username: this._senderName,
            message: this._message,
            styleId: this._chatStyle
        };

        this._window = this._widget.windowManager.renderElement(this.getTemplate(), view);


        // var messageWidth: number;
        // var userIconWindow:IBitmapWrapperWindow;
        // var x1: number;
        // var y1: number;
        // var i: number;
        // var lastLinkEndPos: number;
        // var linkFormat:TextFormat;
        // var filteredLink: string;
        // var placeHolder: string;
        // var placeholderPos: number;
        // var linkPos:Array;
        // if (this._rendered)
        // {
        //     return;
        // }
        // this._rendered = true;
        // if (this._window)
        // {
        //     return;
        // }
        // this._window = RoomChatWidget._Str_5827._Str_25575(this._chatStyle, this._chatType);
        // if (!this._window)
        // {
        //     return;
        // }
        // this._window._Str_4074 = true;
        // var background:IBitmapWrapperWindow = (this._window.findChildByName(BACKGROUND) as IBitmapWrapperWindow);
        // var nameWindow:ILabelWindow = (this._window.findChildByName(NAME) as ILabelWindow);
        // var textWindow:ITextWindow = (this._window.findChildByName(MESSAGE) as ITextWindow);
        // var pointerWindow:IBitmapWrapperWindow = (this._window.findChildByName(POINTER) as IBitmapWrapperWindow);
        // var totalHeight: number = this._window.height;
        // var pointerBitmapData:BitmapData = RoomChatWidget._Str_5827._Str_23013(this._chatStyle);
        // this._originalBackgroundYOffset = background.y;
        // var textWindowOffsetX: number = ((textWindow.x <= _Str_13391) ? 0 : (textWindow.x - _Str_13391));
        // if (this._senderImage != null)
        // {
        //     this._topOffset = Math.max(0, ((this._senderImage.height - background.height) / 2));
        //     totalHeight = Math.max(totalHeight, this._senderImage.height);
        //     totalHeight = Math.max(totalHeight, background.height);
        // }
        // this._width = 0;
        // this._window.x = this._x;
        // this._window.y = this._y;
        // this._window.width = 0;
        // this._window.height = totalHeight;
        // this._Str_16939();
        this._Str_23110(this._window);
        // if (((this._senderImage) && (!(this._Str_21943))))
        // {
        //     userIconWindow = (this._window.findChildByName("user_image") as IBitmapWrapperWindow);
        //     if (userIconWindow)
        //     {
        //         userIconWindow.width = this._senderImage.width;
        //         userIconWindow.height = this._senderImage.height;
        //         userIconWindow.bitmap = this._senderImage;
        //         userIconWindow.disposesBitmap = false;
        //         x1 = (userIconWindow.x - (this._senderImage.width / 2));
        //         y1 = Math.max(0, ((background.height - this._senderImage.height) / 2));
        //         if (this._userType == RoomObjectTypeEnum.PET)
        //         {
        //             if (this._petType == PetTypeEnum.HORSE)
        //             {
        //                 if (this._senderImage.height > background.height)
        //                 {
        //                     y1 = ((this._senderImage.height - background.height) / 2);
        //                 }
        //             }
        //         }
        //         userIconWindow.x = x1;
        //         userIconWindow.y = (userIconWindow.y + y1);
        //         this._width = (this._width + (userIconWindow.x + this._senderImage.width));
        //     }
        // }
        // if (nameWindow != null)
        // {
        //     if (!this._Str_21943)
        //     {
        //         nameWindow.text = (this._senderName + ": ");
        //         nameWindow.y = (nameWindow.y + this._topOffset);
        //         nameWindow.width = (nameWindow.textWidth + _Str_9962);
        //     }
        //     else
        //     {
        //         nameWindow.text = "";
        //         nameWindow.width = 0;
        //     }
        //     this._width = (this._width + nameWindow.width);
        // }
        // if (this._chatType == _Str_3535._Str_5821)
        // {
        //     textWindow.text = this._localizations.registerParameter("widgets.chatbubble.respect", "username", this._senderName);
        //     this._width = _Str_5706;
        // }
        // else
        // {
        //     if (this._chatType == _Str_3535._Str_6081)
        //     {
        //         textWindow.text = this._localizations.registerParameter("widget.chatbubble.petrespect", "petname", this._senderName);
        //         this._width = _Str_5706;
        //     }
        //     else
        //     {
        //         if (this._chatType == _Str_3535._Str_5958)
        //         {
        //             textWindow.text = this._localizations.registerParameter("widget.chatbubble.pettreat", "petname", this._senderName);
        //             this._width = _Str_5706;
        //         }
        //         else
        //         {
        //             if (this._chatType == _Str_3535._Str_6065)
        //             {
        //                 textWindow.text = this.message;
        //                 this._width = _Str_5706;
        //             }
        //             else
        //             {
        //                 if (this._chatType == _Str_3535._Str_5998)
        //                 {
        //                     textWindow.text = this.message;
        //                     this._width = _Str_5706;
        //                 }
        //                 else
        //                 {
        //                     if (this._chatType == _Str_3535._Str_5904)
        //                     {
        //                         textWindow.text = this.message;
        //                         this._width = _Str_5706;
        //                     }
        //                     else
        //                     {
        //                         if (this._chatType == _Str_3535._Str_15836)
        //                         {
        //                             textWindow.text = this.message;
        //                             this._width = _Str_5706;
        //                         }
        //                         else
        //                         {
        //                             if (this._messageLinks == null)
        //                             {
        //                                 textWindow.text = this.message;
        //                             }
        //                             else
        //                             {
        //                                 this._messageLinkPositions = new Array();
        //                                 lastLinkEndPos = -1;
        //                                 i = 0;
        //                                 while (i < this._messageLinks.length)
        //                                 {
        //                                     filteredLink = this._messageLinks[i][1];
        //                                     placeHolder = (("{" + i) + "}");
        //                                     placeholderPos = this._message.indexOf(placeHolder);
        //                                     lastLinkEndPos = (placeholderPos + filteredLink.length);
        //                                     this._messageLinkPositions.push([placeholderPos, lastLinkEndPos]);
        //                                     this._message = this._message.replace(placeHolder, filteredLink);
        //                                     i = (i + 1);
        //                                 }
        //                                 textWindow.text = this.message;
        //                                 textWindow.immediateClickMode = true;
        //                                 textWindow.setParamFlag(WindowParam.WINDOW_PARAM_USE_PARENT_GRAPHIC_CONTEXT, false);
        //                                 textWindow.setParamFlag(WindowParam.WINDOW_PARAM_FORCE_CLIPPING, true);
        //                                 linkFormat = textWindow.getTextFormat();
        //                                 switch (this._chatStyle)
        //                                 {
        //                                     case SystemChatStyleEnum.BOT:
        //                                         linkFormat.color = 0xDDDDDD;
        //                                         break;
        //                                     default:
        //                                         linkFormat.color = 2710438;
        //                                 }
        //                                 linkFormat.underline = true;
        //                                 i = 0;
        //                                 while (i < this._messageLinkPositions.length)
        //                                 {
        //                                     linkPos = this._messageLinkPositions[i];
        //                                     try
        //                                     {
        //                                         textWindow.setTextFormat(linkFormat, linkPos[0], linkPos[1]);
        //                                     }
        //                                     catch(e:RangeError)
        //                                     {
        //                                         Logger.log("Chat message links were malformed. Could not set TextFormat");
        //                                     }
        //                                     i = (i + 1);
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        // if (textWindow.visible)
        // {
        //     textWindow.x = (this._width + textWindowOffsetX);
        //     if (nameWindow != null)
        //     {
        //         textWindow.x = (nameWindow.x + nameWindow.width);
        //         if (nameWindow.width > _Str_9962)
        //         {
        //             textWindow.x = (textWindow.x - (_Str_9962 - 1));
        //         }
        //     }
        //     textWindow.y = (textWindow.y + this._topOffset);
        //     messageWidth = textWindow.textWidth;
        //     textWindow.width = (messageWidth + _Str_15961);
        //     this._width = (this._width + textWindow.width);
        // }
        // if (((!(pointerWindow == null)) && (pointerWindow.visible)))
        // {
        //     pointerWindow.bitmap = pointerBitmapData;
        //     pointerWindow.disposesBitmap = false;
        //     pointerWindow.x = (this._width / 2);
        //     pointerWindow.y = (pointerWindow.y + this._topOffset);
        // }
        // var textWidth: number = textWindow.width;
        // if (nameWindow)
        // {
        //     textWidth = (textWidth + nameWindow.width);
        // }
        // var bitmap:BitmapData = RoomChatWidget._Str_5827._Str_25059(this._chatStyle, this._chatType, textWidth, background.height, this._senderColor);
        // this._window.width = bitmap.width;
        // this._window.y = (this._window.y - this._topOffset);
        // this._window.y = (this._window.y + this._originalBackgroundYOffset);
        // this._width = this._window.width;
        // background.bitmap = bitmap;
        // background.y = this._topOffset;
    }

    public _Str_16939(): void
    {
        this._dragTooltipEnabled = true;

        this._Str_20783();
    }

    public _Str_22093(): void
    {
        this._dragTooltipEnabled = false;

        this._Str_20783();
    }

    private _Str_20783(): void
    {
        if (this._window == null)
        {
            return;
        }
        // this._window._Str_2613 = "";
        // if (this._widget.isGameSession)
        // {
        //     return;
        // }
        // if (this._dragTooltipEnabled)
        // {
        //     this._window._Str_2613 = _Str_17786;
        // }
        // this._window._Str_3099 = 500;
    }

    private _Str_23110(k: HTMLElement): void
    {
        k.addEventListener(MouseEventType.MOUSE_CLICK, this._Str_24326.bind(this));
        k.addEventListener(MouseEventType.MOUSE_DOWN, this._Str_22405.bind(this));
        k.addEventListener(MouseEventType.ROLL_OVER, this._Str_23850.bind(this));
        k.addEventListener(MouseEventType.ROLL_OUT, this._Str_23475.bind(this));
        k.addEventListener(MouseEventType.MOUSE_UP, this._Str_24323.bind(this));
    }

    private _Str_22492(k: number, _arg_2: number): boolean
    {
        // var _local_5: number;
        // var _local_3:ITextWindow = (this._window.getChildByName(MESSAGE) as ITextWindow);
        // var _local_4: number = _local_3.getCharIndexAtPoint((k - _local_3.x), (_arg_2 - _local_3.y));
        // if (_local_4 > -1)
        // {
        //     _local_5 = 0;
        //     while (_local_5 < this._messageLinkPositions.length)
        //     {
        //         if (((_local_4 >= this._messageLinkPositions[_local_5][0]) && (_local_4 <= this._messageLinkPositions[_local_5][1])))
        //         {
        //             if (this._messageLinks[_local_5][2] == 0)
        //             {
        //                 HabboWebTools.open(this._messageLinks[_local_5][0]);
        //             }
        //             else
        //             {
        //                 if (this._messageLinks[_local_5][2] == 1)
        //                 {
        //                     HabboWebTools.openWebPage((this._siteUrl + this._messageLinks[_local_5][0]), "habboMain");
        //                 }
        //                 else
        //                 {
        //                     HabboWebTools.openWebPage((this._siteUrl + this._messageLinks[_local_5][0]));
        //                 }
        //             }
        //             return true;
        //         }
        //         _local_5++;
        //     }
        // }
        return false;
    }

    private _Str_24326(k: MouseEvent): void
    {
        if (((this._messageLinks) && (this._messageLinks.length > 0)))
        {
            if (this._Str_22492(k.x, k.y))
            {
                return;
            }
        }

        this._widget._Str_22991(this._senderId, this._senderName, this._senderCategory, this._roomId, k);
    }

    private _Str_22405(k: MouseEvent): void
    {
        this._widget._Str_24206(this._senderId, this._senderCategory, this._roomId, k);
    }

    private _Str_23850(k: MouseEvent): void
    {
        this._widget._Str_22868(this._senderId, this._senderCategory, this._roomId, k);
    }

    private _Str_23475(k: MouseEvent): void
    {
        this._widget._Str_25858(this._senderId, this._senderCategory, this._roomId, k);
    }

    private _Str_24323(k: MouseEvent): void
    {
        this._widget._Str_20437();
    }

    private getTemplate(): string
    {
        return `
        <div class="chat-item chat-style-{{ styleId }}">
            <div class="chat-left">
                <div class="user-image"></div>
            </div>
            <div class="chat-middle">
                <b>{{ username }}:</b> {{ message }}
            </div>
            <div class="chat-right"></div>
            <div class="chat-pointer"></div>
        </div>`;
    }

    public get _Str_24439(): number
    {
        return this._chatStyle;
    }

    public get _Str_26239(): number
    {
        return this._originalBackgroundYOffset;
    }
}