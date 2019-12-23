import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarDanceUpdateMessage extends ObjectUpdateStateMessage
{
    private _danceStyle: number;

    constructor(danceStyle: number = 0)
    {
        super();

        this._danceStyle = danceStyle;
    }

    public get danceStyle(): number
    {
        return this._danceStyle;
    }
}