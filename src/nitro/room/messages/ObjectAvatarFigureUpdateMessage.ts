import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarFigureUpdateMessage extends ObjectUpdateStateMessage
{
    private _figure: string;
    private _gender: string;
    private _race: string;
    private _isRiding: boolean;

    constructor(figure: string, gender: string = null, race: string = null, isRiding: boolean = false)
    {
        super();

        this._figure    = figure;
        this._gender    = gender;
        this._race      = race;
        this._isRiding  = isRiding;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public get gender(): string
    {
        return this._gender;
    }

    public get race(): string
    {
        return this._race;
    }

    public get isRiding(): boolean
    {
        return this._isRiding;
    }
}