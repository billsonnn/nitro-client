export class AnimationFrame
{
    private _number: number;
    private _assetPartDefinition: string;
    private _repeats: number;

    constructor(data: any)
    {
        if(!data) throw new Error('invalid_data');

        this._number                = parseInt(data['$'].number);
        this._assetPartDefinition   = data['$'].assetpartdefinition;
        this._repeats               = (data['$'].repeats !== undefined ? parseInt(data['$'].repeats) : 1) * 2;
    }

    public get number(): number
    {
        return this._number;
    }

    public get assetPartDefinition(): string
    {
        return this._assetPartDefinition;
    }

    public get repeats(): number
    {
        return this._repeats;
    }
}