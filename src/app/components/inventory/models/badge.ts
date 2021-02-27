export class Badge
{
    private _badgeId: string;
    private _isUnseen: boolean;
    private _isInUse: boolean;
    private _isSelected: boolean;

    constructor(badgeId: string, isUnseen: boolean)
    {
        this._badgeId = badgeId;
        this._isUnseen = isUnseen;
    }

    public get badgeId(): string
    {
        return this._badgeId;
    }

    public get _Str_3222(): boolean
    {
        return this._isInUse;
    }

    public get _Str_2365(): boolean
    {
        return this._isSelected;
    }

    public set _Str_3222(k: boolean)
    {
        this._isInUse = k;
    }

    public set _Str_2365(k: boolean)
    {
        this._isSelected = k;
    }

    public set _Str_3613(k: boolean)
    {
        if(this._isUnseen != k)
        {
            this._isUnseen = k;
            this._Str_2365 = this._isSelected;
        }
    }
}
