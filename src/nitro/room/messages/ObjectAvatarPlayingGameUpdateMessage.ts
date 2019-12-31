import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarPlayingGameUpdateMessage extends ObjectUpdateStateMessage
{
    private _isPlayingGame: boolean;

    constructor(flag: boolean)
    {
        super();

        this._isPlayingGame = flag;
    }

    public get isPlayingGame(): boolean
    {
        return this._isPlayingGame;
    }
}