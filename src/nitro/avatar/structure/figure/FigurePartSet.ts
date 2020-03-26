import { FigurePart } from './FigurePart';
import { IFigurePart } from './IFigurePart';
import { IFigurePartSet } from './IFigurePartSet';

export class FigurePartSet implements IFigurePartSet
{
    private _id: number;
    private _type: string;
    private _gender: string;
    private _clubLevel: number;
    private _isColorable: boolean;
    private _isSelectable: boolean;
    private _parts: IFigurePart[];
    private _hiddenLayers: string[];
    private _isPreSelectable: boolean;
    private _isSellable: boolean;

    constructor(type: string, data: any)
    {
        if(!type || !data) throw new Error('invalid_data');

        this._id                = parseInt(data['$'].id);
        this._type              = type;
        this._gender            = data['$'].gender;
        this._clubLevel         = parseInt(data['$'].club);
        this._isColorable       = parseInt(data['$'].colorable) === 1;
        this._isSelectable      = parseInt(data['$'].selectable) === 1;
        this._parts             = [];
        this._hiddenLayers      = [];
        this._isPreSelectable   = parseInt(data['$'].preselectable) === 1;
        this._isSellable        = parseInt(data['$'].sellable) === 1;
        
        for(let part of data.part)
        {
            const newPart   = new FigurePart(part);
            const partIndex = this.getPartIndex(newPart);

            if(partIndex !== -1) this._parts.splice(partIndex, 0, newPart);
            else this._parts.push(newPart);
        }

        if(data.hiddenlayers)
        {
            const hiddenLayers = data.hiddenlayers[0];

            for(let layer of hiddenLayers.layer) this._hiddenLayers.push(layer['$'].parttype);
        }
    }

    private getPartIndex(part: FigurePart): number
    {
        const totalParts = this._parts.length;

        if(!totalParts) return -1;

        for(let i = 0; i < totalParts; i++)
        {
            const existingPart = this._parts[i];

            if(!existingPart) continue;

            if(existingPart.type !== part.type || existingPart.index > part.index) continue;

            return i;
        }

        return -1;
    }

    public get id(): number
    {
        return this._id;
    }

    public get type(): string
    {
        return this._type;
    }

    public get gender(): string
    {
        return this._gender;
    }

    public get clubLevel(): number
    {
        return this._clubLevel;
    }

    public get isColorable(): boolean
    {
        return this._isColorable;
    }

    public get isSelectable(): boolean
    {
        return this._isSelectable;
    }

    public get parts(): IFigurePart[]
    {
        return this._parts;
    }

    public get hiddenLayers(): string[]
    {
        return this._hiddenLayers;
    }

    public get isPreSelectable(): boolean
    {
        return this._isPreSelectable;
    }

    public get isSellable(): boolean
    {
        return this._isSellable;
    }
}