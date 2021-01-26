import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { AdvancedMap } from '../../../../../../core/utils/AdvancedMap';

export class _Str_6941 implements IMessageParser
{
    private _Str_13713: string[];
    private _Str_13962: string[];
    private _Str_4833: AdvancedMap<string, number>;

    public flush(): boolean
    {
        this._Str_13713 = [];
        this._Str_13962 = [];

        if(this._Str_4833)
        {
            this._Str_4833.dispose();
            this._Str_4833 = null;
        }

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._Str_13713 = [];
        this._Str_13962 = [];
        this._Str_4833  = new AdvancedMap();

        let _local_4 = wrapper.readInt();

        while(_local_4 > 0)
        {
            const _local_2 = wrapper.readInt();
            const _local_3 = wrapper.readString();

            this._Str_4833.add(_local_3, _local_2);
            this._Str_13713.push(_local_3);

            _local_4--;
        }

        let _local_6 = wrapper.readInt();

        while(_local_6 > 0)
        {
            const _local_8 = wrapper.readInt();
            const _local_3 = wrapper.readString();

            this._Str_13962.push(_local_3);

            _local_6--;
        }

        return true;
    }

    public _Str_17775(k: string): number
    {
        return this._Str_4833.getValue(k);
    }

    public _Str_21415(): string[]
    {
        return this._Str_13713;
    }

    public _Str_23681(): string[]
    {
        return this._Str_13962;
    }
}