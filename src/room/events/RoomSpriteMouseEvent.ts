import { ICollision } from '../renderer/ICollision';
import { IVector3D } from '../utils/IVector3D';
import { RoomObjectEvent } from './RoomObjectEvent';

export class RoomSpriteMouseEvent extends RoomObjectEvent
{
    public static CLICK: string         = 'ROE_MOUSE_CLICK';
    public static DOUBLE_CLICK: string  = 'ROW_MOUSE_DOUBLE_CLICK';
    public static MOUSE_MOVE: string    = 'ROE_MOUSE_MOVE';
    public static MOUSE_DOWN: string    = 'ROW_MOUSE_DOWN';
    public static MOUSE_UP: string      = 'ROE_MOUSE_UP';
    
    private _point: PIXI.Point;
    private _location: IVector3D;
    private _collision: ICollision;

    private _altKey: boolean;
    private _ctrlKey: boolean;
    private _shiftKey: boolean;

    constructor(type: string, collision: ICollision, point: PIXI.Point, location: IVector3D, altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false)
    {
        super(type, collision ? collision.object : null);

        this._collision = collision;
        this._point     = point;
        this._location  = location;

        this._altKey    = altKey;
        this._ctrlKey   = ctrlKey;
        this._shiftKey  = shiftKey;
    }

    public get collision(): ICollision
    {
        return this._collision;
    }

    public get point(): PIXI.Point
    {
        return this._point;
    }

    public get location(): IVector3D
    {
        return this._location;
    }

    public get altKey(): boolean
    {
        return this._altKey;
    }

    public get ctrlKey(): boolean
    {
        return this._ctrlKey;
    }

    public get shiftKey(): boolean
    {
        return this._shiftKey;
    }
}