﻿import { IAssetAlias } from '../../../core/asset/interfaces';

export class AssetAlias 
{
    private _name: string;
    private _link: string;
    private _flipH: boolean;
    private _flipV: boolean;

    constructor(name: string, alias: IAssetAlias)
    {
        this._name  = name;
        this._link  = alias.link;
        this._flipH = alias.fliph === 1;
        this._flipV = alias.flipv === 1;
    }

    public get name(): string
    {
        return this._name;
    }

    public get link(): string
    {
        return this._link;
    }

    public get flipH(): boolean
    {
        return this._flipH;
    }

    public get flipV(): boolean
    {
        return this._flipV;
    }
}