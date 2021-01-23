export class RoomWidgetFurniItem
{
    private _id: number;
    private _category: number;
    private _name: string;

    constructor(k: number, _arg_2: number, _arg_3: string)
    {
        this._id = k;
        this._category = _arg_2;
        this._name = _arg_3;
    }

    public get id(): number
    {
        return this._id;
    }

    public get category(): number
    {
        return this._category;
    }

    public get name(): string
    {
        return this._name;
    }
}
