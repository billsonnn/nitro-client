import { Position } from '../../../room/utils/Position';
import { ObjectMoveUpdateMessage } from './ObjectMoveUpdateMessage';

export class ObjectAvatarUpdateMessage extends ObjectMoveUpdateMessage
{
    private _headDirection: number;

    constructor(position: Position, goal: Position, isSlide: boolean = false, headDirection: number = null)
    {
        super(position, goal, isSlide);

        this._headDirection = headDirection === null ? position.direction : headDirection;
    }

    public get headDirection(): number
    {
        return this._headDirection;
    }
}