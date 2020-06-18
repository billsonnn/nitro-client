import { IGraphicAsset } from '../../../../../room/object/visualization/utils/IGraphicAsset';
import { NitroInstance } from '../../../../NitroInstance';
import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';

export class FurnitureThumbnailVisualization extends FurnitureAnimatedVisualization
{
    protected static THUMBNAIL: string = 'THUMBNAIL';

    private _Str_17030: string;
    private _Str_22237: string;
    private _Str_21351: boolean;
    private _Str_20721: PIXI.Graphics;
    private _Str_10040: PIXI.Graphics;
    private _Str_21698: number;
    private _Str_16232: boolean;

    constructor()
    {
        super();

        this._Str_17030 = null;
        this._Str_22237 = null;
        this._Str_21351 = false;
        this._Str_20721 = null;
        this._Str_10040 = null;
        this._Str_21698 = -1;
        this._Str_16232 = false;
    }

    public set _Str_20445(k: boolean)
    {
        this._Str_21351 = k;
    }

    public get _Str_23660(): boolean
    {
        return !(this._Str_10040 == null);
    }

    public _Str_6645(k: PIXI.Graphics, _arg_2: PIXI.Graphics = null): void
    {
        this._Str_10040 = k;
        this._Str_20721 = ((_arg_2 != null) ? _arg_2 : k);
        this._Str_16232 = true;
    }

    protected updateModel(scale: number): boolean
    {
        const flag = super.updateModel(scale);

        if(!this._Str_16232 && (this._Str_21698 === this.direction)) return flag;

        this._Str_25236();

        return true;
    }

    private _Str_25236(): void
    {
        if(this.asset == null) return;

        if(this._Str_10040)
        {
            this._Str_20857(this._Str_10040, 64);
            this._Str_20857(this._Str_20721, 32);
        }
        else
        {
            this.asset.disposeAsset(this._Str_15493(64));
            this.asset.disposeAsset(this._Str_15493(32));
        }

        this._Str_16232 = false;
        this._Str_21698 = this.direction;
    }

    private _Str_20857(k: PIXI.Graphics, scale: number):void
    {
        let layerId = 0;

        while(layerId < this.totalSprites)
        {
            if(this.getLayerTag(scale, this.direction, layerId) === FurnitureThumbnailVisualization.THUMBNAIL)
            {
                const assetName = (this.cacheSpriteAssetName(scale, layerId, false) + this.getFrameNumber(scale, layerId));
                const asset     = this.getAsset(assetName, layerId);

                if(asset)
                {
                    const _local_6 = this._Str_25562(k, asset);
                    const _local_7 = this._Str_15493(scale);
                    this.asset.disposeAsset(_local_7);
                    this.asset.addAsset(_local_7, _local_6, true, asset.offsetX, asset.offsetY, false, false);
                }

                return;
            }

            layerId++;
        }
    }

    private _Str_25562(k: PIXI.Graphics, _arg_2: IGraphicAsset): PIXI.Texture
    {
        let graphic: PIXI.Graphics = null;
        
        const _local_3  = 1.1;
        const matrix    = new PIXI.Matrix();
        const _local_5  = (_arg_2.width / k.width);

        switch(this.direction)
        {
            case 2:
                matrix.a = _local_5;
                matrix.b = (-0.5 * _local_5);
                matrix.c = 0;
                matrix.d = (_local_5 * _local_3);
                matrix.tx = 0;
                matrix.ty = ((0.5 * _local_5) * k.width);
                break;
            case 0:
            case 4:
                matrix.a = _local_5;
                matrix.b = (0.5 * _local_5);
                matrix.c = 0;
                matrix.d = (_local_5 * _local_3);
                matrix.tx = 0;
                matrix.ty = 0;
                break;
            default:
                matrix.a = _local_5;
                matrix.b = 0;
                matrix.c = 0;
                matrix.d = _local_5;
                matrix.tx = 0;
                matrix.ty = 0;
        }

        console.log(matrix);

        const texture = NitroInstance.instance.renderer.generateTexture(k, 1, 1, new PIXI.Rectangle(0, 0, k.width, k.height));

        if(!texture) return null;
        
        // if(this._Str_21351)
        // {
        //     graphic = new PIXI.Graphics()
        //         .drawRect(0, 0, (_arg_2.width + 2), (_arg_2.height + 2));

        //     graphic
        //         .beginTextureFill({ texture, matrix })
        //         .drawRect(0, 0, texture.width, texture.height)
        //         .endFill();
            
        //     matrix.tx = (matrix.tx + 1);
        //     matrix.ty--;

        //     graphic
        //         .beginTextureFill({ texture, matrix })
        //         .drawRect(0, 0, texture.width, texture.height)
        //         .endFill();
                
        //     matrix.ty = (matrix.ty + 2);

        //     graphic
        //         .beginTextureFill({ texture, matrix })
        //         .drawRect(0, 0, texture.width, texture.height)
        //         .endFill();
                
        //     matrix.tx = (matrix.tx + 1);
        //     matrix.ty--;

        //     graphic
        //         .beginTextureFill({ texture, matrix })
        //         .drawRect(0, 0, texture.width, texture.height)
        //         .endFill();

        //     matrix.tx--;

        //     graphic
        //         .beginTextureFill({ texture, matrix })
        //         .drawRect(0, 0, texture.width, texture.height)
        //         .endFill();
        // }
        // else
        // {
            graphic = new PIXI.Graphics()
                .beginTextureFill({ texture, matrix })
                .drawRect(0, 0, _arg_2.width, _arg_2.height)
                .endFill();
        //}

        const graphicTexture = NitroInstance.instance.renderer.generateTexture(graphic, 1, 1);

        if(!graphicTexture) return null;

        return graphicTexture;
    }

    protected getSpriteAssetName(scale: number, layerId: number): string
    {
        if(this._Str_10040 && (this.getLayerTag(scale, this.direction, layerId) === FurnitureThumbnailVisualization.THUMBNAIL)) return this._Str_15493(scale);

        return super.getSpriteAssetName(scale, layerId);
    }

    protected _Str_15493(scale: number): string
    {
        if(!this._Str_17030)
        {
            this._Str_17030 = this._Str_12961(this.object.id, 32);
            this._Str_22237 = this._Str_12961(this.object.id, 64);
        }

        return (scale === 32) ? this._Str_17030 : this._Str_22237;
    }

    protected _Str_12961(k: number, _arg_2: number): string
    {
        return [this._type, k, "thumb", _arg_2].join("_");
    }
}