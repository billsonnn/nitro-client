import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { _Str_6342 } from '../../../incoming/inventory/trading/_Str_6342';

export class _Str_9219 implements IMessageParser
{
    private _Str_16633: number;
    private _Str_12613: _Str_6342[];
    private _Str_18495: number;
    private _Str_18187: number;
    private _Str_18907: number;
    private _Str_12840: _Str_6342[];
    private _Str_16571: number;
    private _Str_17852: number;

    public flush(): boolean
    {
        this._Str_16633 = -1;
        this._Str_12613 = null;
        this._Str_18495 = 0;
        this._Str_18187 = 0;
        this._Str_18907 = -1;
        this._Str_12840 = null;
        this._Str_16571 = 0;
        this._Str_17852 = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._Str_16633 = wrapper.readInt();
        this._Str_12613 = [];

        if(!this._Str_9484(wrapper, this._Str_12613)) return false;
        
        this._Str_18495 = wrapper.readInt();
        this._Str_18187 = wrapper.readInt();
        this._Str_18907 = wrapper.readInt();
        this._Str_12840 = [];

        if(!this._Str_9484(wrapper, this._Str_12840)) return false;

        this._Str_16571 = wrapper.readInt();
        this._Str_17852 = wrapper.readInt();

        return true;
    }

    private _Str_9484(k: IMessageDataWrapper, _arg_2: _Str_6342[]): boolean
    {
        let _local_3 = k.readInt();

        while(_local_3 > 0)
        {
            _arg_2.push(new _Str_6342(k));

            _local_3--;
        }

        return true;
    }

    public get _Str_15162(): number
    {
        return this._Str_16633;
    }

    public get _Str_17841(): _Str_6342[]
    {
        return this._Str_12613;
    }

    public get _Str_14946(): number
    {
        return this._Str_18495;
    }

    public get _Str_15709(): number
    {
        return this._Str_18187;
    }

    public get _Str_18215(): number
    {
        return this._Str_18907;
    }

    public get _Str_17465(): _Str_6342[]
    {
        return this._Str_12840;
    }

    public get _Str_13801(): number
    {
        return this._Str_16571;
    }

    public get _Str_9138(): number
    {
        return this._Str_17852;
    }
}