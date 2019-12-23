import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarSignUpdateMessage extends ObjectUpdateStateMessage
{
    private _signType: number;

    constructor(signType: number = 0)
    {
        super();

        this._signType = signType;
    }

    public get signType(): number
    {
        return this._signType;
    }
}