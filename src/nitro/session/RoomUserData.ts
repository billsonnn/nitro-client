export class RoomUserData
{
    private _unitId: number;
    private _id: number;
    private _name: string;
    private _type: number;
    private _gender: string;
    private _figure: string;
    private _motto: string;

    constructor(unitId: number)
    {
        this._unitId    = unitId;
        this._id        = -1;
        this._name      = null;
        this._type      = null;
        this._gender    = null;
        this._figure    = null;
        this._motto     = null;
    }

    public get unitId(): number
    {
        return this._unitId;
    }

    public get id(): number
    {
        return this._id;
    }

    public set id(id: number)
    {
        this._id = id;
    }

    public get name(): string
    {
        return this._name;
    }

    public set name(name: string)
    {
        this._name = name;
    }

    public get type(): number
    {
        return this._type;
    }

    public set type(type: number)
    {
        this._type = type;
    }

    public get gender(): string
    {
        return this._gender;
    }

    public set gender(gender: string)
    {
        this._gender = gender;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public set figure(figure: string)
    {
        this._figure = figure;
    }

    public get motto(): string
    {
        return this._figure;
    }

    public set motto(motto: string)
    {
        this._motto = motto;
    }
}