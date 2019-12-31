export class PetFigureData
{
    private _typeId: number;
    private _paletteId: number;
    private _color: number;
    private _headOnly: boolean;

    constructor(figure: string)
    {
        const parts         = this.splitFigure(figure);
        const totalParts    = parts.length;
        
        this._typeId    = totalParts >= 1 ? parseInt(parts[0]) : 0;
        this._paletteId = totalParts >= 2 ? parseInt(parts[1]) : 0;
        this._color     = totalParts >= 3 ? parseInt(parts[2], 16) : 0xFFFFFF;
        this._headOnly  = totalParts >= 4 ? parts[3] === 'head' : false;
    }

    private splitFigure(figure: string): string[]
    {
        if(!figure) return [];

        return figure.split(' ');
    }

    public get typeId(): number
    {
        return this._typeId;
    }

    public get paletteId(): number
    {
        return this._paletteId;
    }

    public get color(): number
    {
        return this._color;
    }

    public get headOnly(): boolean
    {
        return this._headOnly;
    }
}