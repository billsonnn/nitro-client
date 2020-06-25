import { INitroWindowManager } from '../../../window/INitroWindowManager';
import { RoomChatWidget } from './RoomChatWidget';

export class RoomChatHistoryPulldown 
{
    public static _Str_6008: number = 3;
    public static _Str_3847: number = 2;
    public static _Str_8230: number = 1;
    public static _Str_5954: number = 0;
    public static _Str_3788: number = 39;
    private static _Str_15421: number = 150;
    private static _Str_14143: number = 250;

    private _widget: RoomChatWidget;
    private _windowManager: INitroWindowManager;
    private _window: HTMLElement;
    private _bgWindow: HTMLElement;
    private _containerWindow: HTMLElement;
    private _region: HTMLElement;
    private _assetLibrary: any;
    private _lastWidth: number = 0;
    private _state: number = -1;
    private _grabBarBgBmp: HTMLImageElement;
    private _grabBarGripBmp: HTMLImageElement;
    private _grabBarHandleBmp: HTMLImageElement;
    private _grabBarXBmp: HTMLImageElement;
    private _grabBarXOverBmp: HTMLImageElement;
    private _grabBarXPressedBmp: HTMLImageElement;
    private _chatHistoryBgBmp: HTMLImageElement;
    private _regionRightMargin: number = 30;

    constructor(k:RoomChatWidget, _arg_2: INitroWindowManager, _arg_3: HTMLElement, _arg_4: any)
    {
//         this._widget = k;
//         this._windowManager = _arg_2;
//         this._assetLibrary = _arg_4;
//         this._containerWindow = _arg_3;
//         this._grabBarBgBmp = ((this._assetLibrary.getAssetByName("chat_grapbar_bg") as BitmapDataAsset).content as BitmapData);
//         this._grabBarGripBmp = ((this._assetLibrary.getAssetByName("chat_grapbar_grip") as BitmapDataAsset).content as BitmapData);
//         this._grabBarHandleBmp = ((this._assetLibrary.getAssetByName("chat_grapbar_handle") as BitmapDataAsset).content as BitmapData);
//         this._grabBarXBmp = ((this._assetLibrary.getAssetByName("chat_grapbar_x") as BitmapDataAsset).content as BitmapData);
//         this._grabBarXOverBmp = ((this._assetLibrary.getAssetByName("chat_grapbar_x_hi") as BitmapDataAsset).content as BitmapData);
//         this._grabBarXPressedBmp = ((this._assetLibrary.getAssetByName("chat_grapbar_x_pr") as BitmapDataAsset).content as BitmapData);
//         this._chatHistoryBgBmp = ((this._assetLibrary.getAssetByName("chat_history_bg") as BitmapDataAsset).content as BitmapData);
//         this._bgWindow = (this._windowManager.createWindow("chat_history_bg", "", WindowType.WINDOW_TYPE_BITMAP_WRAPPER, _Str_3108.DEFAULT, WindowParam.WINDOW_PARAM_USE_PARENT_GRAPHIC_CONTEXT, new Rectangle(0, 0, _arg_3.width, (_arg_3.height - _Str_3788)), null, 0, 0) as IBitmapWrapperWindow);
//         this._containerWindow.addChild(this._bgWindow);
//         this._window = (this._windowManager.createWindow("chat_pulldown", "", WindowType.WINDOW_TYPE_CONTAINER, _Str_3108.DEFAULT, (WindowParam.WINDOW_PARAM_INPUT_EVENT_PROCESSOR | WindowParam.WINDOW_PARAM_USE_PARENT_GRAPHIC_CONTEXT), new Rectangle(0, (this._containerWindow.height - _Str_3788), _arg_3.width, _Str_3788), null, 0) as IWindowContainer);
//         this._containerWindow.addChild(this._window);
//         this._region = (this._windowManager.createWindow("REGIONchat_pulldown", "", WindowType.WINDOW_TYPE_REGION, _Str_3108.NULL, (((WindowParam.WINDOW_PARAM_INPUT_EVENT_PROCESSOR | WindowParam.WINDOW_PARAM_USE_PARENT_GRAPHIC_CONTEXT) | WindowParam.WINDOW_PARAM_RELATIVE_HORIZONTAL_SCALE_FIXED) | WindowParam.WINDOW_PARAM_RELATIVE_VERTICAL_SCALE_FIXED), new Rectangle(0, 0, _arg_3.width, (_arg_3.height - _Str_3788)), null, 0) as IRegionWindow);
//         if (this._region != null)
//         {
//             this._region.background = true;
//             this._region.mouseThreshold = 0;
//             this._region.addEventListener(WindowMouseEvent.DOWN, this._Str_12979);
//             this._containerWindow.addChild(this._region);
//             this._region._Str_2613 = "${chat.history.drag.tooltip}";
//             this._region._Str_3099 = 250;
//         }
//         var _local_5:XmlAsset = (_arg_4.getAssetByName("chat_history_pulldown") as XmlAsset);
//         this._window.buildFromXML((_local_5.content as XML));
//         this._window.addEventListener(WindowMouseEvent.DOWN, this._Str_12979);
//         var _local_6:IBitmapWrapperWindow = (this._window.findChildByName("GrapBarX") as IBitmapWrapperWindow);
//         if (_local_6 != null)
//         {
//             _local_6.mouseThreshold = 0;
//             _local_6.addEventListener(WindowMouseEvent.CLICK, this._Str_23452);
//             _local_6.addEventListener(WindowMouseEvent.UP, this._Str_23294);
//             _local_6.addEventListener(WindowMouseEvent.DOWN, this._Str_22989);
//             _local_6.addEventListener(WindowMouseEvent.OVER, this._Str_25625);
//             _local_6.addEventListener(WindowMouseEvent.OUT, this._Str_24771);
//         }
//         this._window.background = true;
//         this._window.color = 0;
//         this._window.mouseThreshold = 0;
//         this.state = _Str_5954;
//         this._Str_20103();
    }

//     public function dispose():void
//     {
//         if (this._region != null)
//         {
//             this._region.dispose();
//             this._region = null;
//         }
//         if (this._window != null)
//         {
//             this._window.dispose();
//             this._window = null;
//         }
//         if (this._bgWindow != null)
//         {
//             this._bgWindow.dispose();
//             this._bgWindow = null;
//         }
//     }

//     public function update(k:uint):void
//     {
//         switch (this.state)
//         {
//             case _Str_3847:
//                 this._bgWindow.blend = (this._bgWindow.blend + (k / _Str_14143));
//                 this._window.blend = (this._window.blend + (k / _Str_14143));
//                 if (this._window.blend >= 1)
//                 {
//                     this.state = _Str_8230;
//                 }
//                 return;
//             case _Str_6008:
//                 this._bgWindow.blend = (this._bgWindow.blend - (k / _Str_15421));
//                 this._window.blend = (this._window.blend - (k / _Str_15421));
//                 if (this._window.blend <= 0)
//                 {
//                     this.state = _Str_5954;
//                 }
//                 return;
//         }
//     }

    public set state(k: number)
    {
        if (k == this._state)
        {
            return;
        }
//         switch (k)
//         {
//             case _Str_8230:
//                 if (this._state == _Str_5954)
//                 {
//                     this.state = _Str_3847;
//                 }
//                 else
//                 {
//                     if (((this._window == null) || (this._bgWindow == null)))
//                     {
//                         return;
//                     }
//                     this._window.visible = true;
//                     this._bgWindow.visible = true;
//                     this._region.visible = true;
//                     this._state = k;
//                 }
//                 return;
//             case _Str_5954:
//                 if (((this._window == null) || (this._bgWindow == null)))
//                 {
//                     return;
//                 }
//                 this._window.visible = false;
//                 this._bgWindow.visible = false;
//                 this._region.visible = false;
//                 this._state = k;
//                 return;
//             case _Str_3847:
//                 if (((this._window == null) || (this._bgWindow == null)))
//                 {
//                     return;
//                 }
//                 this._window.blend = 0;
//                 this._bgWindow.blend = 0;
//                 this._window.visible = true;
//                 this._bgWindow.visible = true;
//                 this._state = k;
//                 return;
//             case _Str_6008:
//                 if (((this._window == null) || (this._bgWindow == null)))
//                 {
//                     return;
//                 }
//                 this._window.blend = 1;
//                 this._bgWindow.blend = 1;
//                 this._state = k;
//                 return;
//         }
    }

    public get state(): number
    {
        return this._state;
    }

//     public function _Str_8958(k:Rectangle):void
//     {
//         if (this._window != null)
//         {
//             this._window.x = 0;
//             this._window.y = (this._containerWindow.height - _Str_3788);
//             this._window.width = this._containerWindow.width;
//         }
//         if (this._region != null)
//         {
//             this._region.x = 0;
//             this._region.y = (this._containerWindow.height - _Str_3788);
//             this._region.width = (this._containerWindow.width - this._regionRightMargin);
//         }
//         if (this._bgWindow != null)
//         {
//             this._bgWindow.rectangle = this._containerWindow.rectangle;
//             this._bgWindow.height = (this._bgWindow.height - _Str_3788);
//         }
//         this._Str_20103();
//     }

//     private function _Str_20103():void
//     {
//         var width: number;
//         var height: number;
//         var state: number;
//         var destBgBitmap: HTMLImageElement;
//         var destGripLBitmap: HTMLImageElement;
//         var destGripRBitmap: HTMLImageElement;
//         if (this._window == null)
//         {
//             return;
//         }
//         if (this._lastWidth == this._window.width)
//         {
//             return;
//         }
//         this._lastWidth = this._window.width;
//         var barBg:IBitmapWrapperWindow = (this._window.findChildByName("grapBarBg") as IBitmapWrapperWindow);
//         var barX:IBitmapWrapperWindow = (this._window.findChildByName("GrapBarX") as IBitmapWrapperWindow);
//         var barGripL:IBitmapWrapperWindow = (this._window.findChildByName("grapBarGripL") as IBitmapWrapperWindow);
//         var barGripR:IBitmapWrapperWindow = (this._window.findChildByName("grapBarGripR") as IBitmapWrapperWindow);
//         var barHandle:IBitmapWrapperWindow = (this._window.findChildByName("grapBarHandle") as IBitmapWrapperWindow);
//         var gripMargin: number = 5;
//         if (((!(barX == null)) && (!(barHandle == null))))
//         {
//             barHandle.bitmap = this._grabBarHandleBmp;
//             barHandle.disposesBitmap = false;
//             barX.bitmap = this._grabBarXBmp;
//             barX.disposesBitmap = false;
//             this._regionRightMargin = (this._window.width - barX.x);
//         }
//         barGripL.width = (barHandle.x - gripMargin);
//         barGripL.x = 0;
//         barGripR.x = ((barHandle.x + barHandle.width) + gripMargin);
//         barGripR.width = ((barX.x - gripMargin) - barGripR.x);
//         if (barGripL.width < 0)
//         {
//             barGripL.width = 0;
//         }
//         if (barGripR.width < 0)
//         {
//             barGripR.width = 0;
//         }
//         state = 0;
//         if ((((!(barBg == null)) && (!(barGripL == null))) && (!(barGripR == null))))
//         {
//             try
//             {
//                 state = 1;
//                 width = barBg.width;
//                 height = barBg.height;
//                 if (((width > 0) && (height > 0)))
//                 {
//                     destBgBitmap = new TrackedBitmapData(this, width, height);
//                     this._Str_16872(this._grabBarBgBmp, destBgBitmap);
//                     barBg.disposesBitmap = true;
//                     barBg.bitmap = destBgBitmap;
//                 }
//                 state = 2;
//                 width = barGripL.width;
//                 height = barGripL.height;
//                 if (((width > 0) && (height > 0)))
//                 {
//                     destGripLBitmap = new TrackedBitmapData(this, width, height);
//                     this._Str_16872(this._grabBarGripBmp, destGripLBitmap);
//                     barGripL.disposesBitmap = true;
//                     barGripL.bitmap = destGripLBitmap;
//                 }
//                 state = 3;
//                 width = barGripR.width;
//                 height = barGripR.height;
//                 if (((width > 0) && (height > 0)))
//                 {
//                     destGripRBitmap = new TrackedBitmapData(this, width, height);
//                     this._Str_16872(this._grabBarGripBmp, destGripRBitmap);
//                     barGripR.disposesBitmap = true;
//                     barGripR.bitmap = destGripRBitmap;
//                 }
//             }
//             catch(e:Error)
//             {
//                 throw (new Error(((((((e.message + " width:") + width) + " height:") + height) + " state:") + state), e.errorID));
//             }
//         }
//         if (this._bgWindow == null)
//         {
//             return;
//         }
//         this._bgWindow.bitmap = this._chatHistoryBgBmp;
//         this._bgWindow.disposesBitmap = false;
//     }

//     private function _Str_16872(k: HTMLImageElement, _arg_2: HTMLImageElement):void
//     {
//         var _local_3: number = (_arg_2.width / k.width);
//         var _local_4:Point = new Point();
//         var _local_5: number;
//         while (_local_5 < (_local_3 + 1))
//         {
//             _local_4.x = (_local_5 * k.width);
//             _arg_2.copyPixels(k, k.rect, _local_4);
//             _local_5++;
//         }
//     }

//     private function _Str_12979(k:WindowMouseEvent):void
//     {
//         if (this._widget != null)
//         {
//             this._widget._Str_12979(k);
//         }
//     }

//     private function _Str_23452(k:WindowMouseEvent):void
//     {
//         if (this._widget != null)
//         {
//             this._widget._Str_24607(k);
//         }
//     }

//     private function _Str_25625(k:WindowMouseEvent):void
//     {
//         if (this._window == null)
//         {
//             return;
//         }
//         if (!this._window.visible)
//         {
//             return;
//         }
//         var _local_2:IBitmapWrapperWindow = (this._window.findChildByName("GrapBarX") as IBitmapWrapperWindow);
//         if (_local_2 != null)
//         {
//             _local_2.disposesBitmap = false;
//             _local_2.bitmap = this._grabBarXOverBmp;
//         }
//     }

//     private function _Str_24771(k:WindowMouseEvent):void
//     {
//         if (this._window == null)
//         {
//             return;
//         }
//         if (!this._window.visible)
//         {
//             return;
//         }
//         var _local_2:IBitmapWrapperWindow = (this._window.findChildByName("GrapBarX") as IBitmapWrapperWindow);
//         if (_local_2 != null)
//         {
//             _local_2.disposesBitmap = false;
//             _local_2.bitmap = this._grabBarXBmp;
//         }
//     }

//     private function _Str_22989(k:WindowMouseEvent):void
//     {
//         if (this._window == null)
//         {
//             return;
//         }
//         if (!this._window.visible)
//         {
//             return;
//         }
//         var _local_2:IBitmapWrapperWindow = (this._window.findChildByName("GrapBarX") as IBitmapWrapperWindow);
//         if (_local_2 != null)
//         {
//             _local_2.disposesBitmap = false;
//             _local_2.bitmap = this._grabBarXPressedBmp;
//         }
//     }

//     private function _Str_23294(k:WindowMouseEvent):void
//     {
//         if (this._window == null)
//         {
//             return;
//         }
//         if (!this._window.visible)
//         {
//             return;
//         }
//         var _local_2:IBitmapWrapperWindow = (this._window.findChildByName("GrapBarX") as IBitmapWrapperWindow);
//         if (_local_2 != null)
//         {
//             _local_2.disposesBitmap = false;
//             _local_2.bitmap = this._grabBarXOverBmp;
//         }
//     }
}