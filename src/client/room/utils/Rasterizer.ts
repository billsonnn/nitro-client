﻿import { Graphics, Matrix, Texture } from 'pixi.js';
import { TextureUtils } from './TextureUtils';

export class Rasterizer
{
    // public static line(k:BitmapData, _arg_2: Point, _arg_3: Point, _arg_4: number): void
    // {
    //     var _local_5:int;
    //     var _local_6:int;
    //     var _local_7:int;
    //     var _local_8:int;
    //     var _local_9:int;
    //     var _local_10:int;
    //     var _local_11:int = _arg_2.x;
    //     var _local_12:int = _arg_2.y;
    //     _local_5 = (_arg_3.x - _arg_2.x);
    //     _local_6 = (_arg_3.y - _arg_2.y);
    //     _local_8 = ((_local_5 > 0) ? 1 : -1);
    //     _local_9 = ((_local_6 > 0) ? 1 : -1);
    //     _local_5 = Math.abs(_local_5);
    //     _local_6 = Math.abs(_local_6);
    //     k.lock();
    //     k.setPixel32(_local_11, _local_12, _arg_4);
    //     if (((_local_5 == 0) && (_local_6 == 0)))
    //     {
    //         return;
    //     }
    //     if (_local_5 > _local_6)
    //     {
    //         _local_7 = (_local_5 - 1);
    //         while (_local_7 >= 0)
    //         {
    //             _local_10 = (_local_10 + _local_6);
    //             _local_11 = (_local_11 + _local_8);
    //             if (_local_10 >= (_local_5 / 2))
    //             {
    //                 _local_10 = (_local_10 - _local_5);
    //                 _local_12 = (_local_12 + _local_9);
    //             }
    //             k.setPixel32(_local_11, _local_12, _arg_4);
    //             _local_7--;
    //         }
    //     }
    //     else
    //     {
    //         _local_7 = (_local_6 - 1);
    //         while (_local_7 >= 0)
    //         {
    //             _local_10 = (_local_10 + _local_5);
    //             _local_12 = (_local_12 + _local_9);
    //             if (_local_10 >= (_local_6 / 2))
    //             {
    //                 _local_10 = (_local_10 - _local_6);
    //                 _local_11 = (_local_11 + _local_8);
    //             }
    //             k.setPixel32(_local_11, _local_12, _arg_4);
    //             _local_7--;
    //         }
    //     }
    //     k.setPixel32(_arg_3.x, _arg_3.y, _arg_4);
    //     k.unlock();
    // }

    public static _Str_16640(k: Texture): Texture
    {
        if(!k) return null;

        const matrix = new Matrix();

        matrix.scale(-1, 1);
        matrix.translate(k.width, 0);

        const graphic = new Graphics();

        graphic
            .beginTextureFill({
                texture: k,
                matrix
            })
            .drawRect(0, 0, k.width, k.height)
            .endFill();

        return TextureUtils.generateTexture(graphic);
    }

    public static _Str_20706(k: Texture): Texture
    {
        if(!k) return null;

        const matrix = new Matrix();

        matrix.scale(1, -1);
        matrix.translate(0, k.height);

        const graphic = new Graphics();

        graphic
            .beginTextureFill({
                texture: k,
                matrix
            })
            .drawRect(0, 0, k.width, k.height)
            .endFill();

        return TextureUtils.generateTexture(graphic);
    }

    public static _Str_20356(k: Texture): Texture
    {
        if(!k) return null;

        const matrix = new Matrix();

        matrix.scale(-1, -1);
        matrix.translate(k.width, k.height);

        const graphic = new Graphics();

        graphic
            .beginTextureFill({
                texture: k,
                matrix
            })
            .drawRect(0, 0, k.width, k.height)
            .endFill();

        return TextureUtils.generateTexture(graphic);
    }
}