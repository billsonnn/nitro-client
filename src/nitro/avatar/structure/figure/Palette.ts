import { IPalette } from './IPalette';
import { IPartColor } from './IPartColor';
import { PartColor } from './PartColor';

export class Palette implements IPalette
{
    private _id: number;
    private _colors: { [index: string]: IPartColor };

    constructor(data: any)
    {
        if(!data) throw new Error('invalid_data');

        this._id        = parseInt(data['$'].id);
        this._colors    = {};

        for(let color of data.color)
        {
            const newColor = new PartColor(color);

            this._colors[newColor.id.toString()] = newColor;
        }
    }

    public getColor(id: number): IPartColor
    {
        return this._colors[id.toString()];
    }

    public get id(): number
    {
        return this._id;
    }

    public get colors(): { [index: string]: IPartColor }
    {
        return this._colors;
    }
}