import { DisplayObject, Rectangle, Renderer, RenderTexture, SCALE_MODES } from 'pixi.js';
import { Nitro } from '../../nitro/Nitro';

export class TextureUtils
{
    private static _renderer: Renderer = null;

    public static generateTexture(displayObject: DisplayObject, region: Rectangle = null, scaleMode: number = SCALE_MODES.NEAREST, resolution: number = 1): RenderTexture
    {
        if(!displayObject) return null;

        return TextureUtils.getRenderer().generateTexture(displayObject, scaleMode, resolution, region);
    }

    public static destroyRenderTexture(texture: RenderTexture): void
    {
        texture.destroy(true);
    }

    public static generateImage(target: DisplayObject | RenderTexture): HTMLImageElement
    {
        if(!target) return null;
        
        return TextureUtils.getRenderer().extract.image(target);
    }

    public static getRenderer(): Renderer
    {
        if(!TextureUtils._renderer) return Nitro.instance.renderer;

        return TextureUtils._renderer;
    }

    public static setRenderer(renderer: Renderer): void
    {
        TextureUtils._renderer = renderer;
    }
}