import { AnimationItem } from './AnimationItem';

export class PlaneVisualizationAnimationLayer
{
    private _color: number = 0;
    private _bitmapData: PIXI.Graphics = null;
    private _isDisposed: boolean = false;
    private _items: AnimationItem[];

    // constructor(k:XML, _arg_2:IGraphicAssetCollection)
    // {
    //     var _local_3:XMLList;
    //     var _local_4: number;
    //     var _local_5:XML;
    //     var _local_6:String;
    //     var _local_7:IGraphicAsset;
    //     var _local_8:BitmapDataAsset;
    //     var _local_9:BitmapData;
    //     var _local_10:AnimationItem;
    //     this._items = [];
    //     super();
    //     if (((!(k == null)) && (!(_arg_2 == null))))
    //     {
    //         _local_3 = k.item;
    //         _local_4 = 0;
    //         while (_local_4 < _local_3.length())
    //         {
    //             _local_5 = (_local_3[_local_4] as XML);
    //             if (_local_5 != null)
    //             {
    //                 _local_6 = _local_5.@asset;
    //                 _local_7 = _arg_2.getAsset(_local_6);
    //                 if (_local_7 != null)
    //                 {
    //                     _local_8 = (_local_7.asset as BitmapDataAsset);
    //                     if (_local_8 != null)
    //                     {
    //                         _local_9 = (_local_8.content as BitmapData);
    //                         if (_local_9 != null)
    //                         {
    //                             _local_10 = new AnimationItem(parseFloat(_local_5.@x), parseFloat(_local_5.@y), parseFloat(_local_5.@speedX), parseFloat(_local_5.@speedY), _local_9);
    //                             this._items.push(_local_10);
    //                         }
    //                     }
    //                 }
    //             }
    //             _local_4++;
    //         }
    //     }
    // }

    // public get disposed():Boolean
    // {
    //     return this._isDisposed;
    // }

    // public dispose():void
    // {
    //     var k: number;
    //     var _local_2:AnimationItem;
    //     this._isDisposed = true;
    //     if (this._bitmapData != null)
    //     {
    //         this._bitmapData.dispose();
    //         this._bitmapData = null;
    //     }
    //     if (this._items != null)
    //     {
    //         k = 0;
    //         while (k < this._items.length)
    //         {
    //             _local_2 = (this._items[k] as AnimationItem);
    //             if (_local_2 != null)
    //             {
    //                 _local_2.dispose();
    //             }
    //             k++;
    //         }
    //         this._items = [];
    //     }
    // }

    // public _Str_3355():void
    // {
    //     if (this._bitmapData != null)
    //     {
    //         this._bitmapData.dispose();
    //         this._bitmapData = null;
    //     }
    // }

    // public render(k: PIXI.Graphics, _arg_2: number, _arg_3: number, _arg_4: IVector3D, _arg_5: number, _arg_6: number, _arg_7: number, _arg_8: number, _arg_9: number, _arg_10: number, _arg_11: number): PIXI.Graphics
    // {
    //     var _local_12: number;
    //     var _local_13:AnimationItem;
    //     var _local_14:Point;
    //     if ((((k == null) || (!(k.width == _arg_2))) || (!(k.height == _arg_3))))
    //     {
    //         if ((((this._bitmapData == null) || (!(this._bitmapData.width == _arg_2))) || (!(this._bitmapData.height == _arg_3))))
    //         {
    //             if (this._bitmapData != null)
    //             {
    //                 this._bitmapData.dispose();
    //             }
    //             this._bitmapData = new BitmapData(_arg_2, _arg_3, true, 0xFFFFFF);
    //         }
    //         else
    //         {
    //             this._bitmapData.fillRect(this._bitmapData.rect, 0xFFFFFF);
    //         }
    //         k = this._bitmapData;
    //     }
    //     if (((_arg_7 > 0) && (_arg_8 > 0)))
    //     {
    //         _local_12 = 0;
    //         while (_local_12 < this._items.length)
    //         {
    //             _local_13 = (this._items[_local_12] as AnimationItem);
    //             if (_local_13 != null)
    //             {
    //                 _local_14 = _local_13._Str_6729(_arg_7, _arg_8, _arg_9, _arg_10, _arg_11);
    //                 _local_14.x = (_local_14.x - _arg_5);
    //                 _local_14.y = (_local_14.y - _arg_6);
    //                 if (_local_13.bitmapData != null)
    //                 {
    //                     if (((((_local_14.x > -(_local_13.bitmapData.width)) && (_local_14.x < k.width)) && (_local_14.y > -(_local_13.bitmapData.height))) && (_local_14.y < k.height)))
    //                     {
    //                         k.copyPixels(_local_13.bitmapData, _local_13.bitmapData.rect, _local_14, null, null, true);
    //                     }
    //                     if ((((((_local_14.x - _arg_7) > -(_local_13.bitmapData.width)) && ((_local_14.x - _arg_7) < k.width)) && (_local_14.y > -(_local_13.bitmapData.height))) && (_local_14.y < k.height)))
    //                     {
    //                         k.copyPixels(_local_13.bitmapData, _local_13.bitmapData.rect, new Point((_local_14.x - _arg_7), _local_14.y), null, null, true);
    //                     }
    //                     if (((((_local_14.x > -(_local_13.bitmapData.width)) && (_local_14.x < k.width)) && ((_local_14.y - _arg_8) > -(_local_13.bitmapData.height))) && ((_local_14.y - _arg_8) < k.height)))
    //                     {
    //                         k.copyPixels(_local_13.bitmapData, _local_13.bitmapData.rect, new Point(_local_14.x, (_local_14.y - _arg_8)), null, null, true);
    //                     }
    //                     if ((((((_local_14.x - _arg_7) > -(_local_13.bitmapData.width)) && ((_local_14.x - _arg_7) < k.width)) && ((_local_14.y - _arg_8) > -(_local_13.bitmapData.height))) && ((_local_14.y - _arg_8) < k.height)))
    //                     {
    //                         k.copyPixels(_local_13.bitmapData, _local_13.bitmapData.rect, new Point((_local_14.x - _arg_7), (_local_14.y - _arg_8)), null, null, true);
    //                     }
    //                 }
    //             }
    //             _local_12++;
    //         }
    //     }
    //     return k;
    // }
}