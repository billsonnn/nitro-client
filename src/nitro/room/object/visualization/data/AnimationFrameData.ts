export class AnimationFrameData
{
    private _id: number;
    private _x: number;
    private _y: number;
    private _randomX: number;
    private _randomY: number;
    private _repeats: number;

    constructor(id: number, x: number, y: number, randomX: number, randomY: number, repeats: number)
    {
        this._id        = id || 0;
        this._x         = x || 0;
        this._y         = y || 0;
        this._randomX   = randomX || 0;
        this._randomY   = randomY || 0;
        this._repeats   = repeats;
    }

    public get id(): number
    {
        return this._id;
    }

    public get hasDirectionalOffsets(): boolean
    {
        return false;
    }

    public x(direction: number): number
    {
        return this._x;
    }

    public y(direction: number): number
    {
        return this._y;
    }

    public get randomX(): number
    {
        return this._randomX;
    }

    public get randomY(): number
    {
        return this._randomY;
    }

    public get repeats(): number
    {
        return this._repeats;
    }
}