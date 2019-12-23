import { Position } from '../utils/Position';

export class RoomObjectUpdateMessage
{
    private _position: Position;

    constructor(position: Position)
    {
        this._position = position || null;
    }

    public get position(): Position
    {
        return this._position;
    }
}