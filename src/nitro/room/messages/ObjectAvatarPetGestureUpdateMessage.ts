import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarPetGestureUpdateMessage extends ObjectUpdateStateMessage
{
    private _gesture: string;

    constructor(gesture: string)
    {
        super();

        this._gesture = gesture;
    }

    public get gesture(): string
    {
        return this._gesture;
    }
}