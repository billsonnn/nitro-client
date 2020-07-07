﻿import { IGraphicAssetCollection } from '../../../../../../room/object/visualization/utils/IGraphicAssetCollection';
import { IVector3D } from '../../../../../../room/utils/IVector3D';
import { Nitro } from '../../../../../Nitro';
import { PlaneMask } from './PlaneMask';
import { PlaneMaskVisualization } from './PlaneMaskVisualization';

export class PlaneMaskManager 
{
    private _assetCollection: IGraphicAssetCollection;
    private _masks: Map<string, PlaneMask>;
    private _data: any;

    constructor()
    {
        this._assetCollection   = null;
        this._masks             = new Map();
        this._data              = null;
    }

    public get data(): any
    {
        return this._data;
    }

    public dispose(): void
    {
        this._assetCollection   = null;
        this._data              = null;

        if(this._masks && this._masks.size)
        {
            for(let mask of this._masks.values())
            {
                if(!mask) continue;

                mask.dispose();
            }

            this._masks.clear();
        }
    }

    public initialize(k: any): void
    {
        this._data = k;
    }

    public _Str_6703(k: IGraphicAssetCollection): void
    {
        if(!this.data) return;
        
        this._assetCollection = k;

        this._Str_22834(this.data, k);
    }

    private _Str_22834(k: any, _arg_2: IGraphicAssetCollection): void
    {
        if(!k || !_arg_2) return;

        if(k.masks && k.masks.length)
        {
            let index = 0;

            while(index < k.masks.length)
            {
                const mask = k.masks[index];

                if(mask)
                {
                    const id        = mask.id;
                    const existing  = this._masks.get(id);

                    if(existing) continue;

                    const newMask = new PlaneMask();

                    if(mask.visualizations && mask.visualizations.length)
                    {
                        let visualIndex = 0;

                        while(visualIndex < mask.visualizations.length)
                        {
                            const visualization = mask.visualizations[visualIndex];

                            if(visualization)
                            {
                                const size              = visualization.size as number;
                                const maskVisualization = newMask._Str_24540(size);

                                if(maskVisualization)
                                {
                                    const assetName = this._Str_25815(visualization.bitmaps, maskVisualization, _arg_2);

                                    newMask._Str_24425(size, assetName);
                                }
                            }

                            visualIndex++;
                        }
                    }

                    this._masks.set(id, newMask);
                }

                index++;
            }
        }
    }

    private _Str_25815(k: any, _arg_2: PlaneMaskVisualization, _arg_3: IGraphicAssetCollection): string
    {
        if(!k || !k.length) return null;

        let graphicName: string = null;

        for(let bitmap of k)
        {
            if(!bitmap) continue;

            const assetName = bitmap.assetName;
            const asset     = _arg_3.getAsset(assetName);

            if(!asset) continue;

            let normalMinX  = PlaneMaskVisualization._Str_3268;
            let normalMaxX  = PlaneMaskVisualization._Str_3271;
            let normalMinY  = PlaneMaskVisualization._Str_3268;
            let normalMaxY  = PlaneMaskVisualization._Str_3271;

            if(bitmap.normalMinX) normalMinX = bitmap.normalMinX;
            if(bitmap.normalMaxX) normalMaxX = bitmap.normalMaxX;
            if(bitmap.normalMinY) normalMinY = bitmap.normalMinY;
            if(bitmap.normalMaxY) normalMaxY = bitmap.normalMaxY;

            if(!asset.flipH) graphicName = assetName;

            _arg_2._Str_16790(asset, normalMinX, normalMaxX, normalMinY, normalMaxY);
        }

        return graphicName;
    }

    public _Str_17859(k: PIXI.Graphics, _arg_2: string, _arg_3: number, _arg_4: IVector3D, _arg_5: number, _arg_6: number): boolean
    {
        const mask = this._masks.get(_arg_2);

        if(!mask) return true;

        const asset = mask._Str_21021(_arg_3, _arg_4);

        if(!asset) return true;

        const texture = asset.texture;

        if(!texture) return true;

        const point = new PIXI.Point((_arg_5 + asset.offsetX), (_arg_6 + asset.offsetY));

        const graphic = new PIXI.Graphics()
            .beginTextureFill({ texture })
            .drawRect(0, 0, texture.width, texture.height)
            .endFill();

        const maskTexture = Nitro.instance.renderer.generateTexture(graphic, 1, 1, new PIXI.Rectangle(0, 0, texture.width, texture.height));

        if(maskTexture)
        {
            k
                .beginTextureFill({ texture: maskTexture })
                .drawRect(point.x, point.y, texture.width, texture.height)
                .endFill();
        }

        return true;
    }

    public _Str_8361(k: string): PlaneMask
    {
        if(!this._masks || !this._masks.size) return null;

        return this._masks.get(k) || null;
    }
}