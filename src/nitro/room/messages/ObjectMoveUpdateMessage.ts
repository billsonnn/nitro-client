import { RoomObjectUpdateMessage } from '../../../room/messages/RoomObjectUpdateMessage';
import { Position } from '../../../room/utils/Position';

export class ObjectMoveUpdateMessage extends RoomObjectUpdateMessage
{
    private _goal: Position;
    private _isSlide: boolean;

    constructor(position: Position, goal: Position, isSlide: boolean = false)
    {
        super(position);

        this._goal      = goal;
        this._isSlide   = isSlide;
    }

    public get goal(): Position
    {
        return this._goal;
    }

    public get isSlide(): boolean
    {
        return this._isSlide;
    }
}