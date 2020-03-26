import * as PIXI from 'pixi.js-legacy';
import { GraphicAsset } from '../../../../../../../core/asset/GraphicAsset';
import { IVector3D } from '../../../../../../../room/utils/IVector3D';
import { NitroInstance } from '../../../../../../NitroInstance';
import { PlaneTexture } from './PlaneTexture';

export class PlaneMaterialCell 
{
    private _cachedBitmapData: PIXI.Graphics;
    private _texture: PlaneTexture;
    private _extraItemOffsets: PIXI.Point[];
    private _extraItemAssets: GraphicAsset[];
    private _extraItemCount: number = 0;

    constructor(k: PlaneTexture, _arg_2: GraphicAsset[] = null, _arg_3: PIXI.Point[] = null, _arg_4: number = 0)
    {
        this._cachedBitmapData  = null;
        this._texture           = k;
        this._extraItemOffsets  = [];
        this._extraItemAssets   = [];
        this._extraItemCount    = 0;

        if(_arg_2 && _arg_2.length && (_arg_4 > 0))
        {
            let assetIndex = 0;

            while(assetIndex < _arg_2.length)
            {
                const graphic = _arg_2[assetIndex];

                if(graphic) this._extraItemAssets.push(graphic);

                assetIndex++;
            }

            if(this._extraItemAssets.length)
            {
                if(_arg_3)
                {
                    let pointIndex = 0;

                    while(pointIndex < _arg_3.length)
                    {
                        const point = _arg_3[pointIndex];

                        if(point) this._extraItemOffsets.push(new PIXI.Point(point.x, point.y));

                        pointIndex++;
                    }
                }

                this._extraItemCount = _arg_4;
            }
        }
    }

    public get isStatic(): boolean
    {
        return this._extraItemCount == 0;
    }

    public dispose(): void
    {
        if(this._texture)
        {
            this._texture.dispose();

            this._texture = null;
        }

        if(this._cachedBitmapData)
        {
            this._cachedBitmapData.destroy();

            this._cachedBitmapData = null;
        }

        this._extraItemAssets   = null;
        this._extraItemOffsets  = null;
    }

    public _Str_3355(): void
    {
        if(this._cachedBitmapData)
        {
            this._cachedBitmapData.destroy();

            this._cachedBitmapData = null;
        }
    }

    public _Str_9599(k: IVector3D): number
    {
        if(this._texture)
        {
            const texture = this._texture._Str_4913(k);

            if(texture) return texture.height;
        }

        return 0;
    }

    public render(normal: IVector3D, textureOffsetX: number, textureOffsetY: number): PIXI.Graphics
    {
        if(!this._texture) return null;

        const texture = this._texture._Str_4913(normal);

        let bitmap = new PIXI.Graphics();

        bitmap
            .beginTextureFill({ texture })
            .drawRect(0, 0, texture.width, texture.height)
            .endFill();

        if(texture && textureOffsetX && textureOffsetY)
        {
            const sourceBitmap = new PIXI.Graphics();

            sourceBitmap
                .beginFill()
                .drawRect(0, 0, (texture.width * 2), (texture.height * 2))
                .endFill()
                .beginTextureFill({ texture })
                .drawRect(texture.width, 0, texture.width, texture.height)
                .drawRect(0, texture.height, texture.width, texture.height)
                .drawRect(texture.width, texture.height, texture.width, texture.height)
                .endFill();

            bitmap = new PIXI.Graphics();

            bitmap
                .beginFill()
                .drawRect(0, 0, texture.width, texture.height)
                .endFill();

            while(textureOffsetX < 0) textureOffsetX += texture.width;

            while(textureOffsetY < 0) textureOffsetY += texture.height;

            const sourceTexture = NitroInstance.instance.renderer.renderer.generateTexture(sourceBitmap, 1, 1, new PIXI.Rectangle((textureOffsetX % texture.width), (textureOffsetY % texture.height), sourceBitmap.width, sourceBitmap.height));

            if(sourceTexture)
            {
                bitmap
                    .beginTextureFill({ texture: sourceTexture })
                    .drawRect(0, 0, texture.width, texture.height)
                    .endFill();
            }
        }

        if(bitmap)
        {
            if(!this.isStatic)
            {
                if(this._cachedBitmapData)
                {
                    if((this._cachedBitmapData.width !== bitmap.width) || (this._cachedBitmapData.height !== bitmap.height))
                    {
                        this._cachedBitmapData.destroy();

                        this._cachedBitmapData = null;
                    }
                    else
                    {
                        const bitmapTexture = NitroInstance.instance.renderer.renderer.generateTexture(bitmap, 1, 1, new PIXI.Rectangle(0, 0, bitmap.width, bitmap.height));

                        if(bitmapTexture)
                        {
                            this._cachedBitmapData
                                .beginTextureFill({ texture: bitmapTexture })
                                .drawRect(0, 0, bitmap.width, bitmap.height)
                                .endFill();
                        }
                    }
                }

                if(!this._cachedBitmapData) this._cachedBitmapData = bitmap.clone();

                return this._cachedBitmapData;
            }

            return bitmap;
        }

        return null;
    }

    public _Str_2125(k:IVector3D):String
    {
        return (this._texture == null) ? null : this._texture._Str_2125(k);
    }
}