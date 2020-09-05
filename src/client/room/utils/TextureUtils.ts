import * as PIXI from 'pixi.js-legacy';
import { Nitro } from '../../nitro/Nitro';

export class TextureUtils
{
    private static _renderer: PIXI.Renderer | PIXI.CanvasRenderer = null;

    public static generateTexture(displayObject: PIXI.DisplayObject, region: PIXI.Rectangle = null, scaleMode: PIXI.SCALE_MODES = PIXI.SCALE_MODES.NEAREST, resolution: number = 1): PIXI.RenderTexture
    {
        if(!displayObject) return null;

        return TextureUtils.getRenderer().generateTexture(displayObject, scaleMode, resolution, region);
    }

    public static generateImage(target: PIXI.DisplayObject | PIXI.RenderTexture): HTMLImageElement
    {
        if(!target) return null;
        
        return TextureUtils.getRenderer().extract.image(target);
    }

    public static getRenderer(): PIXI.Renderer | PIXI.CanvasRenderer
    {
        if(!TextureUtils._renderer) return Nitro.instance.renderer;

        return TextureUtils._renderer;
    }

    public static setRenderer(renderer: PIXI.Renderer | PIXI.CanvasRenderer): void
    {
        TextureUtils._renderer = renderer;
    }
}