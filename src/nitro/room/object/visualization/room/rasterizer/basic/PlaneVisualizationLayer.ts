﻿import * as PIXI from 'pixi.js-legacy';
import { IVector3D } from '../../../../../../../room/utils/IVector3D';
import { NitroInstance } from '../../../../../../NitroInstance';
import { PlaneMaterial } from './PlaneMaterial';

export class PlaneVisualizationLayer 
{
    public static _Str_1934: number = 0;
    public static ALIGN_TOP: number = 1;
    public static _Str_3606: number = 2;
    public static _Str_6914: number = PlaneVisualizationLayer.ALIGN_TOP;

    private _material: PlaneMaterial;
    private _color: number;
    private _offset: number;
    private _align: number;
    private _bitmapData: PIXI.Graphics;
    private _isDisposed: boolean;

   constructor(k: PlaneMaterial, _arg_2: number, _arg_3: number, _arg_4: number = 0)
    {
        this._material      = k;
        this._offset        = _arg_4;
        this._align         = _arg_3;
        this._color         = _arg_2;
        this._bitmapData    = null;
        this._isDisposed    = false;
    }

    public get offset(): number
    {
        return this._offset;
    }

    public get align(): number
    {
        return this._align;
    }

    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public dispose(): void
    {
        this._isDisposed    = true;
        this._material      = null;

        this._Str_3355();
    }

    public _Str_3355(): void
    {
        if(this._bitmapData)
        {
            this._bitmapData.destroy();

            this._bitmapData = null;
        }
    }

    public render(canvas: PIXI.Graphics, width: number, height: number, normal: IVector3D, useTexture: boolean, offsetX: number, offsetY: number): PIXI.Graphics
    {
        if(!canvas || (canvas.width !== width) || (canvas.height !== height)) canvas = null;

        let bitmapData: PIXI.Graphics = null;

        if(this._material)
        {
            bitmapData = this._material.render(null, width, height, normal, useTexture, offsetX, (offsetY + this.offset), (this.align === PlaneVisualizationLayer.ALIGN_TOP));

            if(bitmapData && (bitmapData !== canvas))
            {
                if(this._bitmapData) this._bitmapData.destroy();
                
                this._bitmapData = bitmapData.clone();

                bitmapData = this._bitmapData;
            }
        }
        else
        {
            if(!canvas)
            {
                if(this._bitmapData && (this._bitmapData.width === width) && (this._bitmapData.height === height)) return this._bitmapData;

                if(this._bitmapData) this._bitmapData.destroy();

                const graphic = new PIXI.Graphics()
                    .beginFill(0xFFFFFFFF)
                    .drawRect(0, 0, width, height)
                    .endFill();

                this._bitmapData = graphic;

                bitmapData = this._bitmapData;
            }
            else
            {
                canvas
                    .beginFill(0xFFFFFF)
                    .drawRect(0, 0, width, height)
                    .endFill();

                bitmapData = canvas;
            }
        }

        if(bitmapData)
        {
            const red: number   = (this._color >> 16);
            const green: number = ((this._color >> 8) & 0xFF);
            const blue: number  = (this._color & 0xFF);

            if(((red < 0xFF) || (green < 0xFF)) || (blue < 0xFF)) this._bitmapData.tint = this._color;

            if(canvas && (bitmapData !== canvas))
            {
                const texture = NitroInstance.instance.renderer.generateTexture(bitmapData, 1, 1, new PIXI.Rectangle(0, 0, width, height));

                if(texture)
                {
                    canvas
                        .beginTextureFill({ texture })
                        .drawRect(0, 0, width, height)
                        .endFill();
                }
                
                bitmapData = canvas;
            }
        }
    
        return bitmapData;
    }

    public _Str_8547():PlaneMaterial
    {
        return this._material;
    }

    public _Str_751(): number
    {
        return this._color;
    }
}