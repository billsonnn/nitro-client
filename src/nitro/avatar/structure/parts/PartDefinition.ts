export class PartDefinition
{
    private _setType: string;
    private _flippedSetType: string;
    private _removeSetType: string;
    private _appendToFigure: boolean;

    constructor(data: any)
    {
        if(!data) throw new Error('invalid_data');

        this._setType           = data['$']['set-type'];
        this._flippedSetType    = data['$']['flipped-set-type'] || null;
        this._removeSetType     = data['$']['remove-set-type'] || null;
        this._appendToFigure    = false;
    }

    public get setType(): string
    {
        return this._setType;
    }

    public get flippedSetType(): string
    {
        return this._flippedSetType;
    }

    public set flippedSetType(type: string)
    {
        this._flippedSetType = type;
    }

    public get removeSetType(): string
    {
        return this._removeSetType;
    }

    public get appendToFigure(): boolean
    {
        return this._appendToFigure;
    }

    public set appendToFigure(flag: boolean)
    {
        this._appendToFigure = flag;
    }
}