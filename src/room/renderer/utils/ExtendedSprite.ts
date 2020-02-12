import * as PIXI from 'pixi.js-legacy';

export class ExtendedSprite extends PIXI.Sprite
{
    private _tag: string;
    private _Str_8253: boolean;
    private _ignoreMouse: boolean;

    private _pairedSpriteId: number;
    private _pairedSpriteUpdateCounter: number;

    constructor(texture?: PIXI.Texture)
    {
        super(texture);
        
        this._tag                       = '';
        this._Str_8253                  = false;
        this._ignoreMouse               = true;

        this._pairedSpriteId            = -1;
        this._pairedSpriteUpdateCounter = -1;
    }

    public containsPoint(point: PIXI.Point): boolean
    {
        if(this.ignoreMouse || (this.blendMode !== PIXI.BLEND_MODES.NORMAL) || !this.texture) return false;

        const localPoint    = this.worldTransform.applyInverse(point);
        const bounds        = this.getLocalBounds();

        if(!bounds || !bounds.contains(localPoint.x, localPoint.y)) return false;

        const texture       = this.texture;
        const baseTexture   = texture.baseTexture;

        //@ts-ignore
        if(!baseTexture.hitMap)
        {
            if(!ExtendedSprite.generateHitMap(baseTexture, 127)) return false;
        }

        //@ts-ignore
        const hitMap        = baseTexture.hitMap;
        const resolution    = baseTexture.resolution;
        const dx            = Math.round((localPoint.x - bounds.x + texture.frame.x) * resolution);
        const dy            = Math.round((localPoint.y - bounds.y + texture.frame.y) * resolution);
        //@ts-ignore
        const num           = dx + dy * baseTexture.hitMapWidth;
        const num32         = num / 32 | 0;
        const numRest       = num - num32 * 32;
        
        return (hitMap[num32] & (1 << numRest)) > 0;
    }
    
    private static generateHitMap(baseTexture: PIXI.BaseTexture, threshold: number): boolean
    {
        if(!baseTexture.resource) return false;

        //@ts-ignore
        const source = baseTexture.resource.source as HTMLCanvasElement;

        if(!source) return false;

        let canvas: HTMLCanvasElement           = null;
        let context: CanvasRenderingContext2D   = null;

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

        const width     = canvas.width;
        const height    = canvas.height;
        const imageData = context.getImageData(0, 0, width, height);

        const hitMap = new Uint32Array(Math.ceil(width * height / 32));
    
        for(let j = 0; j < height; j++)
        {
            for(let i = 0; i < width; i++)
            {
                const num       = j * width + i;
                const num32     = num / 32 | 0;
                const numRest   = num - num32 * 32;
                
                if(imageData.data[4 * num + 3] >= threshold) hitMap[num32] |= (1 << numRest);
            }
        }

        //@ts-ignore
        baseTexture.hitMap      = hitMap;
        //@ts-ignore
        baseTexture.hitMapWidth = width;

        return true;
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