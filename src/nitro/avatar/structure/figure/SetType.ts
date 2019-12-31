import { FigurePartSet } from './FigurePartSet';
import { IFigurePartSet } from './interfaces/IFigurePartSet';

export class SetType
{
    private _type: string;
    private _paletteId: string;
    private _isMandatory: { [index: string]: { [index: number]: boolean }};
    private _partSets: { [index: string]: IFigurePartSet };

    constructor(data: any)
    {
        if(!data) throw new Error('invalid_data');

        this._type              = data['$'].type;
        this._paletteId         = data['$'].paletteid;
        this._isMandatory       = {};
        this._isMandatory['F']  = [ parseInt(data['$'].mand_f_0) === 1, parseInt(data['$'].mand_f_1) === 1 ];
        this._isMandatory['M']  = [ parseInt(data['$'].mand_m_0) === 1, parseInt(data['$'].mand_m_1) === 1 ];
        this._partSets          = {};

        this.parsePartSets(data);
    }

    private parsePartSets(data: any)
    {
        if(!data) return;

        for(let set of data.set)
        {
            const newSet = new FigurePartSet(this._type, set);

            if(!newSet) continue;

            this._partSets[newSet.id.toString()] = newSet;
        }
    }

    public getPartSet(id: string): IFigurePartSet
    {
        if(!id) return null;

        const existing = this._partSets[id];

        if(!existing) return null;

        return existing;
    }

    public get type(): string
    {
        return this._type;
    }

    public get paletteId(): string
    {
        return this._paletteId;
    }
}