import * as PIXI from 'pixi.js-legacy';
import { IRoomObject } from '../IRoomObject';
import { RoomObject } from '../RoomObject';
import { IRoomObjectSprite } from './IRoomObjectSprite';

export class RoomObjectSprite extends PIXI.Sprite implements IRoomObjectSprite
{
    private static SPRITE_COUNTER: number = 0;

    private _instanceId: number;
    private _object: IRoomObject;
    private _boundingRectangle: PIXI.Rectangle;

    private _tag: string;
    private _doesntHide: boolean;

    constructor(name: string, object: IRoomObject)
    {
        super(PIXI.Texture.from(name));

        if(!(object instanceof RoomObject)) throw new Error('invalid_object');

        this.name = name;

        this._instanceId        = RoomObjectSprite.SPRITE_COUNTER++;
        this._object            = object;
        this._boundingRectangle = null;

        this._tag               = null;
        this._doesntHide        = false;

        this.name = name;
    }

    public destroy(options?: {
        children?: boolean;
        texture?: boolean;
        baseTexture?: boolean;
    })
    {
        this._boundingRectangle = null;

        super.destroy(options);
    }

    private createBounds(): PIXI.Rectangle
    {
        if(this._boundingRectangle) return this._boundingRectangle;

        const width     = this.texture.orig.width;
        const height    = this.texture.orig.height;
        const x         = -width * this.anchor.x;
        const y         = -height * this.anchor.y;

        const rectangle = new PIXI.Rectangle(x, y, width, height);

        this._boundingRectangle = rectangle;

        return this._boundingRectangle;
    }

    public containsPoint(point: PIXI.Point): boolean
    {
        if(this.blendMode !== PIXI.BLEND_MODES.NORMAL) return false;

        const localPoint = this.worldTransform.applyInverse(point);

        let bounds = this._boundingRectangle;

        if(!bounds) bounds = this.createBounds();

        if(!bounds) return false;

        if(!bounds.contains(localPoint.x, localPoint.y)) return false;

        const texture       = this.texture;
        const baseTexture   = texture.baseTexture;

        //@ts-ignore
        if(!baseTexture.hitMap)
        {
            if(!RoomObjectSprite.generateHitMap(baseTexture, 127)) return false;
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
    
    public static generateHitMap(baseTexture: PIXI.BaseTexture, threshold: number): boolean
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

    public get instanceId(): number
    {
        return this._instanceId;
    }

    public get object(): IRoomObject
    {
        return this._object;
    }

    public get boundingRectangle(): PIXI.Rectangle
    {
        return this._boundingRectangle;
    }

    public get tag(): string
    {
        return this._tag;
    }

    public set tag(tag: string)
    {
        this._tag = tag;
    }

    public get doesntHide(): boolean
    {
        return this._doesntHide;
    }

    public set doesntHide(flag: boolean)
    {
        this._doesntHide = flag;
    }

    public get ignoreMouse(): boolean
    {
        return !this.interactive;
    }

    public set ignoreMouse(flag: boolean)
    {
        this.interactive = !flag;
    }
}