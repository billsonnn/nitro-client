import { FurnitureType } from './FurnitureType';
import { IFurnitureData } from './IFurnitureData';

export class FurnitureData
{
    private _id: number;
    private _type: string;
    private _fullName: string;
    private _className: string;
    private _colorId: number;
    private _data: IFurnitureData;

    constructor(type: FurnitureType, data: IFurnitureData)
    {
        if(!type || !data) throw new Error('invalid_data');

        const [ className, colorId ] = data.className.split('*');

        this._id        = data.id;
        this._type      = type;
        this._fullName  = data.className;
        this._className = className;
        this._colorId   = parseInt(colorId) || 0;
        this._data      = data;
    }

    public get id(): number
    {
        return this._id;
    }

    public get type(): string
    {
        return this._type;
    }

    public get fullName(): string
    {
        return this._fullName;
    }

    public get className(): string
    {
        return this._className;
    }

    public get colorId(): number
    {
        return this._colorId;
    }

    public get data(): IFurnitureData
    {
        return this._data;
    }
}