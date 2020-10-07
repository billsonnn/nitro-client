﻿import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';

export class Achievement 
{
    public static _Str_21736: number = -1;
    public static _Str_21318: number = 0;
    public static _Str_15908: number = 1;
    public static _Str_20384: number = 2;

    private _achievementId: number;
    private _level: number;
    private _badgeId: string;
    private _Str_6791: number;
    private _Str_18274: number;
    private _Str_10280: number;
    private _Str_12282: number;
    private _Str_19007: number;
    private _Str_16081: boolean;
    private _category: string;
    private _Str_21707: string;
    private _Str_20339: number;
    private _Str_19099: number;

    constructor(wrapper: IMessageDataWrapper)
    {
        if(!wrapper) throw new Error('invalid_parser');

        this._achievementId = wrapper.readInt();
        this._level         = wrapper.readInt();
        this._badgeId       = wrapper.readString();
        this._Str_6791      = wrapper.readInt();
        this._Str_18274     = Math.max(1, wrapper.readInt());
        this._Str_10280     = wrapper.readInt();
        this._Str_12282     = wrapper.readInt();
        this._Str_19007     = wrapper.readInt();
        this._Str_16081     = wrapper.readBoolean();
        this._category      = wrapper.readString();
        this._Str_21707     = wrapper.readString();
        this._Str_20339     = wrapper.readInt();
        this._Str_19099     = wrapper.readInt();
    }

    public get achievementId(): number
    {
        return this._achievementId;
    }

    public get badgeId(): string
    {
        return this._badgeId;
    }

    public get level(): number
    {
        return this._level;
    }

    public get _Str_25209(): number
    {
        return this._Str_6791;
    }

    public get _Str_24142(): number
    {
        return (this._Str_18274 - this._Str_6791);
    }

    public get _Str_20874(): number
    {
        return this._Str_10280;
    }

    public get _Str_21187(): number
    {
        return this._Str_12282;
    }

    public get _Str_22939(): number
    {
        return (this._Str_19007 - this._Str_6791);
    }

    public get _Str_7518(): boolean
    {
        return this._Str_16081;
    }

    public get category(): string
    {
        return this._category;
    }

    public get _Str_25896(): string
    {
        return this._Str_21707;
    }

    public get _Str_20475(): number
    {
        return this._Str_20339;
    }

    public get _Str_10438(): boolean
    {
        return (this._level > 1) || (this._Str_16081);
    }

    public _Str_24410(): void
    {
        this._Str_19007 = this._Str_18274;
    }

    public get _Str_24874(): number
    {
        return this._Str_19099;
    }
}