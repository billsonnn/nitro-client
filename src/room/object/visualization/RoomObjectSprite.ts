import * as PIXI from 'pixi.js-legacy';
import { ICollision } from '../../renderer/ICollision';
import { IVector3D } from '../../utils/IVector3D';
import { IRoomObjectController } from '../IRoomObjectController';
import { IRoomObjectSprite } from './IRoomObjectSprite';

export class RoomObjectSprite extends PIXI.Sprite implements IRoomObjectSprite, ICollision
{
    private static SPRITE_COUNTER: number = 0;

    private _instanceId: number;
    private _boundingRectangle: PIXI.Rectangle;
    private _object: IRoomObjectController;
    private _tilePosition: IVector3D;

    private _tag: string;
    private _doesntHide: boolean;

    constructor(object: IRoomObjectController, name: string, source: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | PIXI.BaseTexture, texture: PIXI.Texture = null)
    {
        super(texture ? texture : PIXI.Texture.from(source));

        this._instanceId        = RoomObjectSprite.SPRITE_COUNTER++;
        this._boundingRectangle = null;
        this._object            = object;
        this._tilePosition      = null;

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
        if(!this.interactive || this.blendMode !== PIXI.BLEND_MODES.NORMAL) return false;

        const localPoint = this.worldTransform.applyInverse(point);

        let bounds = this._boundingRectangle || this.createBounds();

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

    public get instanceId(): number
    {
        return this._instanceId;
    }

    public get boundingRectangle(): PIXI.Rectangle
    {
        return this._boundingRectangle;
    }

    public get object(): IRoomObjectController
    {
        return this._object;
    }

    public get tilePosition(): IVector3D
    {
        return this._tilePosition;
    }

    public set tilePosition(vector: IVector3D)
    {
        this._tilePosition = vector;
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