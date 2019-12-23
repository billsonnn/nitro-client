import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarSleepUpdateMessage extends ObjectUpdateStateMessage
{
    private _isSleeping: boolean;

    constructor(isSleeping: boolean = false)
    {
        super();

        this._isSleeping = isSleeping;
    }

    public get isSleeping(): boolean
    {
        return this._isSleeping;
    }
}