import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarTypingUpdateMessage extends ObjectUpdateStateMessage
{
    private _isTyping: boolean;

    constructor(isTyping: boolean = false)
    {
        super();

        this._isTyping = isTyping;
    }

    public get isTyping(): boolean
    {
        return this._isTyping;
    }
}