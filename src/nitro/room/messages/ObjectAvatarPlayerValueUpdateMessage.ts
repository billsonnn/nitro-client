import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarPlayerValueUpdateMessage extends ObjectUpdateStateMessage
{
    private _value: number;

    constructor(value: number)
    {
        super();

        this._value = value;
    }

    public get value(): number
    {
        return this._value;
    }
}