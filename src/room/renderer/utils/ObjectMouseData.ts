export class ObjectMouseData 
{
    private _objectId: string;
    private _spriteTag: string;

    constructor()
    {
        this._objectId  = '';
        this._spriteTag = '';
    }

    public get _Str_1577(): string
    {
        return this._objectId;
    }

    public set _Str_1577(k: string)
    {
        this._objectId = k;
    }

    public get _Str_4216(): string
    {
        return this._spriteTag;
    }

    public set _Str_4216(k: string)
    {
        this._spriteTag = k;
    }
}