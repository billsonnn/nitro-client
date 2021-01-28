import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';

export class RoomWidgetCreditFurniUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWCFUE_CREDIT_FURNI_UPDATE: string = 'RWCFUE_CREDIT_FURNI_UPDATE';

    private _Str_2319: number;
    private _Str_12356: number;
    private _furniType: string;

    constructor(k: string, furniType: string, _arg_2: number, _arg_3: number)
    {
        super(k);

        this._Str_12356 = _arg_3;
        this._Str_2319 = _arg_2;
        this._furniType = furniType;
    }

    public get _Str_22599(): number
    {
        return this._Str_12356;
    }

    public get _Str_1577(): number
    {
        return this._Str_2319;
    }

    public get furniType(): string
    {
        return this._furniType;
    }
}
