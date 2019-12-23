import { IRoomObjectSprite } from '../object/visualization/IRoomObjectSprite';
import { RoomObjectCollision } from '../object/visualization/RoomObjectCollision';

export class RoomObjectMouseEvent
{
    public static CLICK: string         = 'click';
    public static DOUBLE_CLICK: string  = 'double_click';
    public static MOUSE_MOVE: string    = 'mouse_move';
    public static MOUSE_DOWN: string    = 'mouse_down';
    public static MOUSE_UP: string      = 'mouse_up';
    
    private _type: string;
    private _point: PIXI.Point;
    private _collision: IRoomObjectSprite | RoomObjectCollision | PIXI.DisplayObject;

    constructor(type: string, point: PIXI.Point, collision: IRoomObjectSprite | RoomObjectCollision | PIXI.DisplayObject)
    {
        if(!type) throw new Error('invalid_type');

        this._type      = type;
        this._point     = point;
        this._collision = collision;
    }

    public get type(): string
    {
        return this._type;
    }

    public get point(): PIXI.Point
    {
        return this._point;
    }

    public get collision(): IRoomObjectSprite | RoomObjectCollision | PIXI.DisplayObject
    {
        return this._collision;
    }
}