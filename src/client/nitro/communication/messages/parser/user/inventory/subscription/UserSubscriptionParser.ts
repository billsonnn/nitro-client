import { IMessageDataWrapper } from '../../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../../core/communication/messages/IMessageParser';

export class UserSubscriptionParser implements IMessageParser
{
    private _name: string;
    private _days: number;
    private _int1: number;
    private _months: number;
    private _years: number;
    private _bool1: boolean;
    private _isVip: boolean;
    private _pastClubDays: number;
    private _int3: number;
    private _totalSeconds: number;

    public static readonly _Str_14729: number = 3;

    public flush(): boolean
    {
        this._name          = null;
        this._days          = 0;
        this._int1          = 0;
        this._months        = 0;
        this._years         = 0;
        this._bool1         = false;
        this._isVip         = false;
        this._pastClubDays          = 0;
        this._int3          = 0;
        this._totalSeconds  = 0;

        return true;
    }

    // see class _Str_4007
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;
        /*
            this._Str_19265 = k.readInteger();
            this._Str_19345 = k.readInteger();
            this._Str_19583 = k.readInteger();
            this._Str_22116 = k.readInteger();
            this._Str_19758 = k.readBoolean();
            this._Str_6923 = k.readBoolean();
            this._Str_11060 = k.readInteger();
            this._Str_11826 = k.readInteger();
            this._Str_6262 = k.readInteger();
         */
        this._name          = wrapper.readString();
        this._days          = wrapper.readInt();
        this._int1          = wrapper.readInt();
        this._months        = wrapper.readInt();
        this._years         = wrapper.readInt();
        this._bool1         = wrapper.readBoolean();
        this._isVip         = wrapper.readBoolean();
        this._pastClubDays  = wrapper.readInt();
        this._int3          = wrapper.readInt();
        this._totalSeconds  = wrapper.readInt();
        return true;
    }

    public get name(): string
    {
        return this._name;
    }

    public get days(): number
    {
        return this._days;
    }

    public get int1(): number
    {
        return this._int1;
    }

    public get months(): number
    {
        return this._months;
    }

    public get years(): number
    {
        return this._years;
    }

    public get bool1(): boolean
    {
        return this._bool1;
    }

    public get isVip(): boolean
    {
        return this._isVip;
    }

    public get pastClubDays(): number
    {
        return this._pastClubDays;
    }

    public get int3(): number
    {
        return this._int3;
    }

    public get totalSeconds(): number
    {
        return this._totalSeconds;
    }
}
