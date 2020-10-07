import { AlphaTolerance } from '../enum/AlphaTolerance';
import { RoomObjectSpriteType } from '../enum/RoomObjectSpriteType';
import { IRoomObjectSprite } from './IRoomObjectSprite';

export class RoomObjectSprite implements IRoomObjectSprite
{
    private static SPRITE_COUNTER: number = 0;

    private _id: number;
    private _name: string;
    private _type: string;
    private _spriteType: number;
    private _texture: PIXI.Texture;

    private _width: number;
    private _height: number;
    private _offsetX: number;
    private _offsetY: number;
    private _flipH: boolean;
    private _flipV: boolean;
    private _direction: number;

    private _alpha: number;
    private _blendMode: number;
    private _color: number;
    private _relativeDepth: number;
    private _Str_8253: boolean;
    private _Str_11397: string;
    private _clickHandling: boolean;
    private _visible: boolean;
    private _tag: string;
    private _posture: string;
    private _alphaTolerance: number;
    private _filters: PIXI.Filter[];

    private _updateCounter: number;

    constructor()
    {
        this._id                = RoomObjectSprite.SPRITE_COUNTER++;
        this._name              = '';
        this._type              = '';
        this._spriteType        = RoomObjectSpriteType.DEFAULT;
        this._texture           = null;

        this._width             = 0;
        this._height            = 0;
        this._offsetX           = 0;
        this._offsetY           = 0;
        this._flipH             = false;
        this._flipV             = false;
        this._direction         = 0;

        this._alpha             = 255;
        this._blendMode         = PIXI.BLEND_MODES.NORMAL;
        this._color             = 0xFFFFFF;
        this._relativeDepth     = 0;
        this._Str_8253          = false;
        this._Str_11397         = '';
        this._clickHandling     = false;
        this._visible           = true;
        this._tag               = '';
        this._posture           = null;
        this._alphaTolerance    = AlphaTolerance._Str_9735;
        this._filters           = [];

        this._updateCounter     = 0;
    }

    public dispose(): void
    {
        this._texture   = null;
        this._width     = 0;
        this._height    = 0;
    }

    public get id(): number
    {
        return this._id;
    }

    public set id(id: number)
    {
        this._id = id;
    }

    public get name(): string
    {
        return this._name;
    }

    public set name(name: string)
    {
        if(this._name === name) return;

        this._name = name;

        this._updateCounter++;
    }

    public get type(): string
    {
        return this._type;
    }

    public set type(type: string)
    {
        this._type = type;
    }

    public get spriteType(): number
    {
        return this._spriteType;
    }

    public set spriteType(type: number)
    {
        this._spriteType = type;
    }

    public get texture(): PIXI.Texture
    {
        return this._texture;
    }

    public set texture(texture: PIXI.Texture)
    {
        if(this._texture === texture) return;

        if(texture)
        {
            this._width     = texture.width;
            this._height    = texture.height;
        }

        this._texture = texture;

        this._updateCounter++;
    }

    public get width(): number
    {
        return this._width;
    }

    public get height(): number
    {
        return this._height;
    }

    public get offsetX(): number
    {
        return this._offsetX;
    }

    public set offsetX(x: number)
    {
        if(this._offsetX === x) return;

        this._offsetX = x;

        this._updateCounter++;
    }

    public get offsetY(): number
    {
        return this._offsetY;
    }

    public set offsetY(y: number)
    {
        if(this._offsetY === y) return;

        this._offsetY = y;

        this._updateCounter++;
    }

    public get flipH(): boolean
    {
        return this._flipH;
    }

    public set flipH(flip: boolean)
    {
        if(this._flipH === flip) return;

        this._flipH = flip;

        this._updateCounter++;
    }

    public get flipV(): boolean
    {
        return this._flipV;
    }

    public set flipV(flip: boolean)
    {
        if(this._flipV === flip) return;

        this._flipV = flip;

        this._updateCounter++;
    }

    public get direction(): number
    {
        return this._direction;
    }

    public set direction(direction: number)
    {
        this._direction = direction;
    }

    public get alpha(): number
    {
        return this._alpha;
    }

    public set alpha(alpha: number)
    {
        alpha = (alpha & 0xFF);

        if(this._alpha === alpha) return;

        this._alpha = alpha;

        this._updateCounter++;
    }

    public get blendMode(): number
    {
        return this._blendMode;
    }

    public set blendMode(blend: number)
    {
        if(this._blendMode === blend) return;

        this._blendMode = blend;

        this._updateCounter++;
    }

    public get color(): number
    {
        return this._color;
    }

    public set color(color: number)
    {
        color = (color & 0xFFFFFF);

        if(this._color === color) return;

        this._color = color;

        this._updateCounter++;
    }

    public get relativeDepth(): number
    {
        return this._relativeDepth;
    }

    public set relativeDepth(depth: number)
    {
        if(this._relativeDepth === depth) return;

        this._relativeDepth = depth;

        this._updateCounter++;
    }

    public get _Str_4593(): boolean
    {
        return this._Str_8253;
    }

    public set _Str_4593(flag: boolean)
    {
        if(flag === this._Str_8253) return;

        this._Str_8253 = flag;

        this._updateCounter++;
    }

    public get _Str_3582(): string
    {
        return this._Str_11397;
    }

    public set _Str_3582(value: string)
    {
        this._Str_11397 = value;
    }

    public get clickHandling(): boolean
    {
        return this._clickHandling;
    }

    public set clickHandling(flag: boolean)
    {
        this._clickHandling = flag;
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(visible: boolean)
    {
        if(this._visible === visible) return;

        this._visible = visible;

        this._updateCounter++;
    }

    public get tag(): string
    {
        return this._tag;
    }

    public set tag(tag: string)
    {
        if(this._tag === tag) return;

        this._tag = tag;

        this._updateCounter++;
    }

    public get posture(): string
    {
        return this._posture;
    }

    public set posture(posture: string)
    {
        if(this._posture === posture) return;

        this._posture = posture;

        this._updateCounter++;
    }

    public get alphaTolerance(): number
    {
        return this._alphaTolerance;
    }

    public set alphaTolerance(tolerance: number)
    {
        if(this._alphaTolerance === tolerance) return;

        this._alphaTolerance = tolerance;

        this._updateCounter++;
    }

    public get filters(): PIXI.Filter[]
    {
        return this._filters;
    }

    public set filters(filters: PIXI.Filter[])
    {
        this._filters = filters;
    }

    public get updateCounter(): number
    {
        return this._updateCounter;
    }
}