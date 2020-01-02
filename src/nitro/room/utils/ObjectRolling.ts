import { Position } from '../../../room/utils/Position';

export class ObjectRolling
{
    public static MOVE: string  = 'mv';
    public static SLIDE: string = 'sld';
    
    private _id: number;
    private _fromPosition: Position;
    private _toPosition: Position;
    private _movementType: string;

    constructor(id: number, fromPosition: Position, toPosition: Position, movementType: string = null)
    {
        this._id            = id;
        this._fromPosition  = fromPosition;
        this._toPosition    = toPosition;
        this._movementType  = movementType;
    }

    public get id(): number
    {
        return this._id;
    }

    public get fromPosition(): Position
    {
        return this._fromPosition;
    }

    public get toPosition(): Position
    {
        return this._toPosition;
    }

    public get movementType(): string
    {
        return this._movementType;
    }
}