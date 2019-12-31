import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarMutedUpdateMessage extends ObjectUpdateStateMessage
{
    private _isMuted: boolean;

    constructor(isMuted: boolean = false)
    {
        super();

        this._isMuted = isMuted;
    }

    public get isMuted(): boolean
    {
        return this._isMuted;
    }
}