export class ActionType
{
    private _id: number;
    private _prevents: string[];
    private _preventHeadTurn: boolean;
    private _isAnimated: boolean;

    constructor(data: any)
    {
        if(!data) throw new Error('invalid_data');

        this._id                = parseInt(data['$'].id);
        this._prevents          = [];
        this._preventHeadTurn   = data['$'].preventheadturn === 'true';
        this._isAnimated        = true;

        const prevents = data['$'].prevents;

        if(prevents) this._prevents = prevents.split(',');

        const isAnimated = data['$'].animated;

        if(isAnimated === undefined || isAnimated === '') this._isAnimated = true;
        else this._isAnimated = isAnimated === 'true' ? true : false;
    }

    public get id(): number
    {
        return this._id;
    }

    public get prevents(): string[]
    {
        return this._prevents;
    }

    public get preventHeadTurn(): boolean
    {
        return this._preventHeadTurn;
    }

    public get isAnimated(): boolean
    {
        return this._isAnimated;
    }
}