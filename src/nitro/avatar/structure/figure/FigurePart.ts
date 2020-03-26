import { IFigurePart } from './IFigurePart';

export class FigurePart implements IFigurePart
{
    private _id: number;
    private _type: string;
    private _breed: number;
    private _index: number;
    private _colorLayerIndex: number;
    private _paletteMapId: number;
    private _library: string;

    constructor(data: any)
    {
        if(!data) throw new Error('invalid_data');

        this._id                = parseInt(data['$'].id);
        this._type              = data['$'].type;
        this._index             = parseInt(data['$'].index);
        this._colorLayerIndex   = parseInt(data['$'].colorindex);

        const paletteMapId  = data['$'].palettemapid;

        if(!isNaN(paletteMapId)) this._paletteMapId = parseInt(paletteMapId);
        else this._paletteMapId = -1;

        const breed  = data['$'].palettemapid;

        if(!isNaN(breed)) this._breed = parseInt(breed);
        else this._breed = -1;

        this._library = null;
    }

    public get id(): number
    {
        return this._id;
    }

    public get type(): string
    {
        return this._type;
    }

    public get breed(): number
    {
        return this._breed;
    }

    public get index(): number
    {
        return this._index;
    }

    public get colorLayerIndex(): number
    {
        return this._colorLayerIndex;
    }

    public get paletteMapId(): number
    {
        return this._paletteMapId;
    }

    public get library(): string
    {
        return this._library;
    }

    public set library(library: string)
    {
        this._library = library;
    }
}