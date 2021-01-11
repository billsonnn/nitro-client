export class _Str_5478 
{
    private _id: number         = 0;
    private _type: number       = 0;
    private _color: number      = 0;
    private _Str_3576: number   = 0;
    private  _Str_2479: boolean = false;

    constructor(k: number)
    {
        this._id = k;
    }

    public _Str_4710(): void
    {
        this._Str_2479 = true;
    }

    public get id(): number
    {
        return this._id;
    }

    public get type(): number
    {
        return this._type;
    }

    public set type(k: number)
    {
        if(!this._Str_2479) this._type = k;
    }

    public get color(): number
    {
        return this._color;
    }

    public set color(k: number)
    {
        if(!this._Str_2479) this._color = k;
    }

    public get _Str_4272(): number
    {
        return this._Str_3576;
    }

    public set _Str_4272(k: number)
    {
        if(!this._Str_2479) this._Str_3576 = k;
    }
}