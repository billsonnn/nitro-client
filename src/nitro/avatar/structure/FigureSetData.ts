import { IFigurePartSet } from './figure/interfaces/IFigurePartSet';
import { IPalette } from './figure/interfaces/IPalette';
import { Palette } from './figure/Palette';
import { SetType } from './figure/SetType';

export class FigureSetData
{
    private _palettes: { [index: string]: IPalette };
    private _setTypes: { [index: string]: SetType };

    private _isReady: boolean;

    constructor()
    {
        this._palettes  = {};
        this._setTypes  = {};

        this._isReady   = false;
    }

    public parse(data: any): boolean
    {
        if(!data) return false;

        for(let palette of data.colors[0].palette)
        {
            const newPalette = new Palette(palette);

            if(!newPalette) continue;

            this._palettes[newPalette.id.toString()] = newPalette;
        }

        for(let set of data.sets[0].settype)
        {
            const newSet = new SetType(set);

            if(!newSet) continue;

            this._setTypes[newSet.type] = newSet;
        }

        this._isReady = true;

        return true;
    }

    public getSet(type: string): SetType
    {
        if(!type) return null;

        const existing = this._setTypes[type];

        if(!existing) return null;

        return existing;
    }

    public getFigurePartSet(type: string, id: string): IFigurePartSet
    {
        const setType = this.getSet(type);

        if(!setType) return null;

        const partSet = setType.getPartSet(id);

        if(!partSet) return null;

        return partSet;
    }

    public getPalette(id: string): IPalette
    {
        return this._palettes[id];
    }

    public get setTypes(): { [index: string]: SetType }
    {
        return this._setTypes;
    }

    public get isReady(): boolean
    {
        return this._isReady;
    }
}