import * as PIXI from 'pixi.js-legacy';
import { NitroInstance } from '../../../nitro/NitroInstance';

export class ExtendedSprite extends PIXI.Sprite
{
    private _offsetX: number;
    private _offsetY: number;
    private _tag: string;
    private _Str_8253: boolean;
    private _ignoreMouse: boolean;

    private _pairedSpriteId: number;
    private _pairedSpriteUpdateCounter: number;

    constructor(texture?: PIXI.Texture)
    {
        super(texture);
        
        this._offsetX                   = 0;
        this._offsetY                   = 0;
        this._tag                       = '';
        this._Str_8253                  = false;
        this._ignoreMouse               = true;

        this._pairedSpriteId            = -1;
        this._pairedSpriteUpdateCounter = -1;
    }

    public needsUpdate(pairedSpriteId: number, pairedSpriteUpdateCounter: number): boolean
    {
        if((this._pairedSpriteId === pairedSpriteId) && (this._pairedSpriteUpdateCounter === pairedSpriteUpdateCounter)) return false;

        this._pairedSpriteId            = pairedSpriteId;
        this._pairedSpriteUpdateCounter = pairedSpriteUpdateCounter;

        return true;
    }

    public setTexture(texture: PIXI.Texture): void
    {
        if(texture === this.texture) return;

        this.texture = texture;

        if(!texture)
        {
            this._pairedSpriteId            = -1;
            this._pairedSpriteUpdateCounter = -1;
        }
    }

    public containsPoint(point: PIXI.Point): boolean
    {
        if(this._ignoreMouse) return false;
        
        return ExtendedSprite.containsPoint(this, point);
    }

    public static containsPoint(sprite: ExtendedSprite, point: PIXI.Point): boolean
    {
        if(!sprite || !point) return false;

        if(sprite instanceof PIXI.Sprite)
        {
            if((sprite.blendMode !== PIXI.BLEND_MODES.NORMAL) || !sprite.texture) return false;

            let checkX = point.x;
            let checkY = point.y;

            if(sprite.scale.x === -1) checkX += sprite.width;

            if(sprite.scale.y === -1) checkY += sprite.height;

            if(((checkX < 0) || (checkY < 0)) || (checkX >= sprite.width) || (checkY >= sprite.height)) return false;

            const texture       = sprite.texture;
            const baseTexture   = texture.baseTexture;

            //@ts-ignore
            if(!baseTexture.hitMap)
            {
                let canvas: HTMLCanvasElement = null;

                if(!baseTexture.resource)
                {
                    canvas = NitroInstance.instance.renderer.renderer.extract.canvas(texture as PIXI.RenderTexture);
                }

                if(!ExtendedSprite.generateHitMap(baseTexture, 128, canvas)) return false;
            }

            //@ts-ignore
            const hitMap        = baseTexture.hitMap;
            const resolution    = baseTexture.resolution;
            const dx            = Math.round((checkX + texture.frame.x) * resolution);
            const dy            = Math.round((checkY + texture.frame.y) * resolution);
            //@ts-ignore
            const num           = (dx + (dy * baseTexture.hitMapWidth));
            const num32         = ((num / 32) | 0);
            const numRest       = (num - (num32 * 32));

            return ((hitMap[num32] & (1 << numRest)) !== 0);
        }

        return false;
    }
    
    private static generateHitMap(baseTexture: PIXI.BaseTexture, threshold: number, tempCanvas: HTMLCanvasElement = null): boolean
    {
        let canvas: HTMLCanvasElement           = null;
        let context: CanvasRenderingContext2D   = null;

        if(tempCanvas)
        {
            canvas  = tempCanvas;
            context = canvas.getContext('2d');
        }
        else
        {
            if(!baseTexture.resource) return false;

            //@ts-ignore
            let source = baseTexture.resource.source as HTMLCanvasElement;

            if(!source) return false;

            if(source.getContext)
            {
                canvas  = source;
                context = canvas.getContext('2d');
            }
            
            else if(source instanceof Image)
            {
                canvas          = document.createElement('canvas');
                canvas.width    = source.width;
                canvas.height   = source.height;
                context         = canvas.getContext('2d');

                context.drawImage(source, 0, 0);
            }

            else return false;
        }

        const width     = canvas.width;
        const height    = canvas.height;
        const imageData = context.getImageData(0, 0, width, height);
        const hitMap    = new Uint32Array(Math.ceil(width * height / 32));
    
        for(let j = 0; j < height; j++)
        {
            for(let i = 0; i < width; i++)
            {
                const num       = j * width + i;
                const num32     = num / 32 | 0;
                const numRest   = num - num32 * 32;
                
                if(imageData.data[(4 * num) + 3] > threshold) hitMap[num32] |= (1 << numRest);
            }
        }

        //@ts-ignore
        baseTexture.hitMap      = hitMap;
        //@ts-ignore
        baseTexture.hitMapWidth = width;

        return true;
    }

    public get offsetX(): number
    {
        return this._offsetX;
    }

    public set offsetX(offset: number)
    {
        this._offsetX = offset;
    }

    public get offsetY(): number
    {
        return this._offsetY;
    }

    public set offsetY(offset: number)
    {
        this._offsetY = offset;
    }

    public get tag(): string
    {
        return this._tag;
    }

    public set tag(tag: string)
    {
        this._tag = tag;
    }

    public get _Str_4593(): boolean
    {
        return this._Str_8253;
    }

    public set _Str_4593(flag: boolean)
    {
        this._Str_8253 = flag;
    }

    public get ignoreMouse(): boolean
    {
        return this._ignoreMouse;
    }

    public set ignoreMouse(flag: boolean)
    {
        this._ignoreMouse = flag;
    }
}