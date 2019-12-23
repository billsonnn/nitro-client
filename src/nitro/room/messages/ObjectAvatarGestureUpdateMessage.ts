import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarGestureUpdateMessage extends ObjectUpdateStateMessage
{
    private _gesture: number;

    constructor(gesture: number = 0)
    {
        super();

        this._gesture = gesture;
    }

    public get gesture(): number
    {
        return this._gesture;
    }
}