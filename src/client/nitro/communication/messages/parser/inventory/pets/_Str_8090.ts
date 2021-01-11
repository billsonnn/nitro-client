import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { AdvancedMap } from '../../../../../../core/utils/AdvancedMap';
import { _Str_2848 } from './_Str_2848';

export class _Str_8090 implements IMessageParser
{
    protected _Str_6580: number;
    protected _Str_6945: number;
    private _Str_8680: AdvancedMap<number, _Str_2848>;

    public flush(): boolean
    {
        if(this._Str_8680)
        {
            this._Str_8680.dispose();
            this._Str_8680 = null;
        }

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        this._Str_6580 = wrapper.readInt();
        this._Str_6945 = wrapper.readInt();

        let totalCount: number = wrapper.readInt();

        this._Str_8680 = new AdvancedMap();

        while(totalCount > 0)
        {
            const _local_4 = new _Str_2848(wrapper);

            this._Str_8680.add(_local_4.id, _local_4);

            totalCount--;
        }

        return true;
    }

    public get _Str_24388(): AdvancedMap<number, _Str_2848>
    {
        return this._Str_8680;
    }

    public get _Str_7430(): number
    {
        return this._Str_6580;
    }

    public get _Str_9600(): number
    {
        return this._Str_6945;
    }
}