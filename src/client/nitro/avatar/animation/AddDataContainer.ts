﻿export class AddDataContainer 
{
    private _id: string;
    private _align: string;
    private _base: string;
    private _ink: string;
    private _blend: number;

    constructor(k: any)
    {
        this._id    = k.id || '';
        this._align = k.align || '';
        this._base  = k.base || '';
        this._ink   = k.ink || 0;
        this._blend = 0;

        var _local_2 = k.blend;

        if(_local_2)
        {
            if (_local_2.length > 0)
            {
                this._blend = parseInt(_local_2);

                if(this._blend > 1) this._blend = (this._blend / 100);
            }
        }
    }

    public get id(): string
    {
        return this._id;
    }

    public get align(): string
    {
        return this._align;
    }

    public get base(): string
    {
        return this._base;
    }

    public get ink(): string
    {
        return this._ink;
    }

    public get blend(): number
    {
        return this._blend;
    }

    public get _Str_1096(): boolean
    {
        return this._blend !== 1;
    }
}