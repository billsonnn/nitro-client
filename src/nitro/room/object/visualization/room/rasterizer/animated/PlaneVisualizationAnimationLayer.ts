import { GraphicAssetCollection } from '../../../../../../../core/asset/GraphicAssetCollection';
import { IDisposable } from '../../../../../../../core/common/disposable/IDisposable';
import { IVector3D } from '../../../../../../../room/utils/IVector3D';
import { AnimationItem } from './AnimationItem';

export class PlaneVisualizationAnimationLayer implements IDisposable
{
    private _color: number = 0;
    private _bitmapData: PIXI.Graphics = null;
    private _isDisposed: boolean = false;
    private _items: AnimationItem[];

    constructor(k: any, _arg_2: GraphicAssetCollection)
    {
        this._color         = 0;
        this._bitmapData    = null;
        this._isDisposed    = false;
        this._items         = [];

        if(k && _arg_2)
        {
            for(let item of k)
            {
                if(!item) continue;

                const assetName = item.asset;

                if(assetName)
                {
                    const asset = _arg_2.getAsset(assetName);

                    if(asset) this._items.push(new AnimationItem(item.x, item.y, item.speedX, item.speedY, asset))
                }
            }
        }
    }

    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public dispose():void
    {
        this._isDisposed = true;

        if(this._bitmapData)
        {
            this._bitmapData.destroy();

            this._bitmapData = null;
        }

        if(this._items)
        {
            for(let item of this._items) item && item.dispose();

            this._items = [];
        }
    }

    public _Str_3355():void
    {
        if (this._bitmapData)
        {
            this._bitmapData.destroy();

            this._bitmapData = null;
        }
    }

    public render(k: PIXI.Graphics, _arg_2: number, _arg_3: number, _arg_4: IVector3D, _arg_5: number, _arg_6: number, _arg_7: number, _arg_8: number, _arg_9: number, _arg_10: number, _arg_11: number): PIXI.Graphics
    {
        return null;
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
    }
}