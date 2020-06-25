import { IDisposable } from '../../../../core/common/disposable/IDisposable';
import { INitroWindowManager } from '../../../window/INitroWindowManager';
import { RoomChatHistoryPulldown } from './RoomChatHistoryPulldown';
import { RoomChatWidget } from './RoomChatWidget';

export class RoomChatHistoryViewer implements IDisposable
{
    private static _Str_16289: number = 18;
    private static _Str_4906: number = 20;
    public static _Str_14515: number = 3;

    private _historyPulldown:RoomChatHistoryPulldown;
    private _historyViewerActive: boolean = false;
    private _historyViewerDragStartY: number = -1;
    private _scrollbarWindow: HTMLElement;
    private _scrollTarget: number = 1;
    private _disabled: boolean = false;
    private _widget:RoomChatWidget;
    private _isDisposed: boolean = false;
    private _forcedResize: boolean = false;
    private _hysteresisBlockOn: boolean = false;

    constructor(k: RoomChatWidget, _arg_2: INitroWindowManager, _arg_3: HTMLElement)
    {
        this._isDisposed = false;
        this._widget = k;
        this._historyPulldown = new RoomChatHistoryPulldown(k, _arg_2, _arg_3, null);
        this._historyPulldown.state = RoomChatHistoryPulldown._Str_5954;
        var _local_5 = (_arg_3.getElementsByClassName('chat-contentlist')[0] as HTMLElement);
        if (_local_5 == null)
        {
            return;
        }
        _arg_3.removeChild(_local_5);
        _arg_3.appendChild(_local_5);
        this._scrollbarWindow = document.createElement('div');
        _arg_3.appendChild(this._scrollbarWindow);
        this._scrollbarWindow.style.visibility = 'none';
       // this._scrollbarWindow.scrollable = (_local_5 as IScrollableWindow);
    }

    public set disabled(k: boolean)
    {
        this._disabled = k;
    }

    public set visible(k: boolean)
    {
        if (((this._historyPulldown == null) || (this._disabled)))
        {
            return;
        }
        this._historyPulldown.state = ((k) ? RoomChatHistoryPulldown._Str_8230 : RoomChatHistoryPulldown._Str_5954);
    }

    public get active(): boolean
    {
        return this._historyViewerActive;
    }

    public get _Str_10683(): number
    {
        return (this._historyViewerActive) ? RoomChatHistoryViewer._Str_4906 : 0;
    }

    public get _Str_22103(): number
    {
        return RoomChatHistoryPulldown._Str_3788;
    }

    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get visible(): boolean
    {
        if (this._historyPulldown == null)
        {
            return false;
        }
        return (this._historyPulldown.state == RoomChatHistoryPulldown._Str_8230) || (this._historyPulldown.state == RoomChatHistoryPulldown._Str_3847);
    }

    public dispose():void
    {
        // this._Str_7189();
        // if (this._scrollbarWindow != null)
        // {
        //     this._scrollbarWindow.dispose();
        //     this._scrollbarWindow = null;
        // }
        // if (this._historyPulldown != null)
        // {
        //     this._historyPulldown.dispose();
        //     this._historyPulldown = null;
        // }
        // this._isDisposed = true;
    }

    public update(k: number):void
    {
        // if (this._historyPulldown != null)
        // {
        //     this._historyPulldown.update(k);
        // }
        // this._Str_17156();
    }

    public _Str_24994():void
    {
        // if (this._historyViewerActive)
        // {
        //     this._Str_7189();
        // }
        // else
        // {
        //     this._Str_18199();
        // }
    }

    public _Str_7189():void
    {
        // this._scrollTarget = 1;
        // this._Str_21402();
        // this._historyViewerActive = false;
        // this._Str_20323(false);
        // this._historyPulldown.state = RoomChatHistoryPulldown._Str_5954;
        // if (this._widget != null)
        // {
        //     this._widget._Str_8599();
        //     this._widget._Str_25376();
        //     this._widget.handler.container.toolbar.extensionView.extraMargin = 0;
        // }
    }

    public _Str_18199():void
    {
        // var k:RoomChatItem;
        // var _local_2:int;
        // var _local_3:IWindowContainer;
        // if (((!(this._historyViewerActive)) && (!(this._disabled))))
        // {
        //     this._historyViewerActive = true;
        //     this._Str_20323(true);
        //     this._historyPulldown.state = RoomChatHistoryPulldown._Str_8230;
        //     if (this._widget != null)
        //     {
        //         this._widget._Str_20247();
        //         this._widget._Str_25298();
        //     }
        // }
    }

    private _Str_20323(k: boolean):void
    {
        // if (this._scrollbarWindow != null)
        // {
        //     this._scrollbarWindow.visible = k;
        //     if (k)
        //     {
        //         this._scrollbarWindow.scrollV = 1;
        //         this._scrollTarget = 1;
        //     }
        //     else
        //     {
        //         this._historyViewerActive = false;
        //         this._historyViewerDragStartY = -1;
        //     }
        // }
    }

    public _Str_8958(k: DOMRect, _arg_2: boolean=false):void
    {
        // if (this._scrollbarWindow != null)
        // {
        //     this._scrollbarWindow.x = ((k.x + k.width) - this._scrollbarWindow.width);
        //     this._scrollbarWindow.y = k.y;
        //     this._scrollbarWindow.height = (k.height - RoomChatHistoryPulldown._Str_3788);
        //     if (_arg_2)
        //     {
        //         this._scrollbarWindow.scrollV = this._scrollTarget;
        //     }
        // }
        // if (this._historyPulldown != null)
        // {
        //     this._historyPulldown._Str_8958(k);
        // }
    }

    private _Str_24773(k: number, _arg_2: boolean=false):void
    {
        // var _local_3: number;
        // var _local_4: number;
        // var _local_5: number;
        // var _local_6:int;
        // var _local_7: boolean;
        // var _local_8: boolean;
        // if (((this._historyViewerDragStartY > 0) && (_arg_2)))
        // {
        //     if (this._hysteresisBlockOn)
        //     {
        //         if (Math.abs((k - this._historyViewerDragStartY)) > _Str_14515)
        //         {
        //             this._hysteresisBlockOn = false;
        //         }
        //         else
        //         {
        //             return;
        //         }
        //     }
        //     if (!this._historyViewerActive)
        //     {
        //         this._widget._Str_23995();
        //         this._Str_18199();
        //         this._Str_17156();
        //     }
        //     if (this._historyViewerActive)
        //     {
        //         this._widget.handler.container.toolbar.extensionView.extraMargin = HabboToolbarEnum._Str_18993;
        //         this._Str_17156();
        //         _local_4 = (this._scrollbarWindow.scrollable._Str_2614.height / this._scrollbarWindow.scrollable._Str_3707.height);
        //         _local_5 = ((k - this._historyViewerDragStartY) / this._scrollbarWindow.height);
        //         _local_3 = (this._scrollTarget - (_local_5 / _local_4));
        //         _local_3 = Math.max(0, _local_3);
        //         _local_3 = Math.min(1, _local_3);
        //         _local_6 = (k - this._historyViewerDragStartY);
        //         _local_7 = true;
        //         _local_8 = true;
        //         if (this._scrollbarWindow.scrollV < (1 - (_Str_16289 / this._scrollbarWindow.scrollable._Str_2614.height)))
        //         {
        //             _local_8 = false;
        //         }
        //         if (((_local_8) || (this._forcedResize)))
        //         {
        //             this._widget._Str_23426(_local_6);
        //             _local_7 = false;
        //             this._scrollTarget = 1;
        //             this._scrollbarWindow.scrollV = 1;
        //         }
        //         if (_local_7)
        //         {
        //             this._scrollTarget = _local_3;
        //         }
        //         this._historyViewerDragStartY = k;
        //     }
        // }
        // else
        // {
        //     this._historyViewerDragStartY = -1;
        // }
    }

    public _Str_19757(k: number, _arg_2: boolean=false):void
    {
        // var _local_3:DisplayObject;
        // var _local_4:Stage;
        // if (this._disabled)
        // {
        //     return;
        // }
        // this._historyViewerDragStartY = k;
        // this._forcedResize = _arg_2;
        // this._hysteresisBlockOn = true;
        // if (this._scrollbarWindow != null)
        // {
        //     this._scrollTarget = this._scrollbarWindow.scrollV;
        // }
        // if (this._scrollbarWindow != null)
        // {
        //     _local_3 = this._scrollbarWindow.context.getDesktopWindow().getDisplayObject();
        //     if (_local_3 != null)
        //     {
        //         _local_4 = _local_3.stage;
        //         if (_local_4 != null)
        //         {
        //             _local_4.addEventListener(MouseEvent.MOUSE_MOVE, this._Str_3983);
        //             _local_4.addEventListener(MouseEvent.MOUSE_UP, this._Str_1703);
        //         }
        //     }
        // }
    }

    public _Str_21402():void
    {
        // var k:DisplayObject;
        // var _local_2:Stage;
        // this._historyViewerDragStartY = -1;
        // if (this._scrollbarWindow != null)
        // {
        //     k = this._scrollbarWindow.context.getDesktopWindow().getDisplayObject();
        //     if (k != null)
        //     {
        //         _local_2 = k.stage;
        //         if (_local_2 != null)
        //         {
        //             _local_2.removeEventListener(MouseEvent.MOUSE_MOVE, this._Str_3983);
        //             _local_2.removeEventListener(MouseEvent.MOUSE_UP, this._Str_1703);
        //         }
        //     }
        // }
    }

    private _Str_17156():void
    {
        // if (!this._historyViewerActive)
        // {
        //     return;
        // }
        // if (this._historyViewerDragStartY < 0)
        // {
        //     return;
        // }
        // if (this._forcedResize)
        // {
        //     return;
        // }
        // var k: number = (this._scrollTarget - this._scrollbarWindow.scrollV);
        // if (k == 0)
        // {
        //     return;
        // }
        // if (Math.abs(k) < 0.01)
        // {
        //     this._scrollbarWindow.scrollV = this._scrollTarget;
        // }
        // else
        // {
        //     this._scrollbarWindow.scrollV = (this._scrollbarWindow.scrollV + (k / 2));
        // }
    }

    private _Str_1703(k: MouseEvent):void
    {
        // this._Str_21402();
        // if (this._widget != null)
        // {
        //     this._widget._Str_20437();
        // }
    }

    private _Str_3983(k: MouseEvent):void
    {
        this._Str_24773(k.clientY, false);
    }
}