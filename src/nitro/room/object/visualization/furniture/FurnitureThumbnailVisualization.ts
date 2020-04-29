import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';

export class FurnitureThumbnailVisualization extends FurnitureAnimatedVisualization
{
    protected static THUMBNAIL: string = 'THUMBNAIL';

    private _thumbnailDirection: number;
    private _Str_16232: boolean;
    private _Str_10040: PIXI.Graphics;

    constructor()
    {
        super();

        this._thumbnailDirection    = -1;
        this._Str_16232             = false;
        this._Str_10040             = null;
    }

    protected updateModel(scale: number): boolean
    {
        const flag = super.updateModel(scale);

        if(!this._Str_16232 && (this._thumbnailDirection === this.direction)) return flag;

        return true;
    }

    // private _Str_25236():void
    // {
    //     if(!this.asset) return;

    //     if (this._Str_10040)
    //     {
    //         this._Str_20857(this._Str_10040, 64);
    //         this._Str_20857(this._Str_20721, 32);
    //     }
    //     else
    //     {
    //         _Str_2697.disposeAsset(this._Str_15493(64));
    //         _Str_2697.disposeAsset(this._Str_15493(32));
    //     }
    //     this._Str_16232 = false;
    //     this._Str_21698 = direction;
    // }

    // private _Str_20857(k: PIXI.Graphics, scale: number):void
    // {
    //     var _local_4:String;
    //     var _local_5:IGraphicAsset;
    //     var _local_6:BitmapData;
    //     var _local_7:String;
    //     let layerId = 0;

    //     while(layerId < this.totalSprites)
    //     {
    //         if(this.getLayerTag(scale, this.direction, layerId) === FurnitureThumbnailVisualization.THUMBNAIL)
    //         {
    //             const assetName = (this.cacheSpriteAssetName(scale, layerId, false) + this.getFrameNumber(scale, layerId));
    //             const asset     = this.getAsset(assetName, layerId);

    //             if(asset)
    //             {
    //                 _local_6 = this._Str_25562(k, _local_5);
    //                 _local_7 = this._Str_15493(scale);
    //                 _Str_2697.disposeAsset(_local_7);
    //                 _Str_2697.addAsset(_local_7, _local_6, true, _local_5.offsetX, _local_5.offsetY);
    //             }
    //             return;
    //         }
    //         _local_3++;
    //     }
    // }

    // private _Str_25562(k:BitmapData, _arg_2:IGraphicAsset):BitmapData
    // {
    //     var _local_6:BitmapData;
    //     var _local_7:Bitmap;
    //     var _local_8:ColorTransform;
    //     var _local_3 = 1.1;
    //     const matrix = new PIXI.Matrix();
    //     const _local_5 = (_arg_2.width / k.width);

    //     switch(this.direction)
    //     {
    //         case 2:
    //             matrix.a = _local_5;
    //             matrix.b = (-0.5 * _local_5);
    //             matrix.c = 0;
    //             matrix.d = (_local_5 * _local_3);
    //             matrix.tx = 0;
    //             matrix.ty = ((0.5 * _local_5) * k.width);
    //             break;
    //         case 0:
    //         case 4:
    //             matrix.a = _local_5;
    //             matrix.b = (0.5 * _local_5);
    //             matrix.c = 0;
    //             matrix.d = (_local_5 * _local_3);
    //             matrix.tx = 0;
    //             matrix.ty = 0;
    //             break;
    //         default:
    //             matrix.a = _local_5;
    //             matrix.b = 0;
    //             matrix.c = 0;
    //             matrix.d = _local_5;
    //             matrix.tx = 0;
    //             matrix.ty = 0;
    //     }
    //     if (this._Str_21351)
    //     {
    //         _local_6 = new BitmapData((_arg_2.width + 2), (_arg_2.height + 2), true, 0);
    //         _local_7 = new Bitmap(k);
    //         _local_8 = new ColorTransform();
    //         _local_8.color = 0;
    //         _local_6.draw(_local_7, matrix, _local_8);
    //         matrix.tx = (matrix.tx + 1);
    //         matrix.ty--;
    //         _local_6.draw(_local_7, matrix, _local_8);
    //         matrix.ty = (matrix.ty + 2);
    //         _local_6.draw(_local_7, matrix, _local_8);
    //         matrix.tx = (matrix.tx + 1);
    //         matrix.ty--;
    //         _local_6.draw(_local_7, matrix, _local_8);
    //         matrix.tx--;
    //         _local_6.draw(_local_7, matrix);
    //     }
    //     else
    //     {
    //         _local_6 = new BitmapData(_arg_2.width, _arg_2.height, true, 0);
    //         _local_6.draw(k, matrix);
    //     }
    //     return _local_6;
    // }

    // protected _Str_15493(k:int):String
    // {
    //     if (this._Str_17030 == null)
    //     {
    //         this._Str_17030 = this._Str_12961(object.getId(), 32);
    //         this._Str_22237 = this._Str_12961(object.getId(), 64);
    //     }
    //     return (k == 32) ? this._Str_17030 : this._Str_22237;
    // }

    // protected _Str_12961(k:int, _arg_2:int):String
    // {
    //     return [type, k, "thumb", _arg_2].join("_");
    // }
}