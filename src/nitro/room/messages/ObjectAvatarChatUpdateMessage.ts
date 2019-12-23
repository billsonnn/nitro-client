import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarChatUpdateMessage extends ObjectUpdateStateMessage
{
    private _numberOfWords: number;

    constructor(numberOfWords: number = 0)
    {
        super();

        this._numberOfWords = numberOfWords;
    }

    public get numberOfWords(): number
    {
        return this._numberOfWords;
    }
}