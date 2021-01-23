import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetFurniItem } from './RoomWidgetFurniItem';

export class RoomWidgetChooserContentEvent extends RoomWidgetUpdateEvent
{
    public static RWCCE_USER_CHOOSER_CONTENT: string = 'RWCCE_USER_CHOOSER_CONTENT';
    public static RWCCE_FURNI_CHOOSER_CONTENT: string = 'RWCCE_FURNI_CHOOSER_CONTENT';

    private _items: RoomWidgetFurniItem[];
    private _Str_10043: boolean;

    constructor(k: string, _arg_2: RoomWidgetFurniItem[], _arg_3: boolean = false)
    {
        super(k);

        this._items = _arg_2.slice();
        this._Str_10043 = _arg_3;
    }

    public get items(): RoomWidgetFurniItem[]
    {
        return this._items;
    }

    public get _Str_2799(): boolean
    {
        return this._Str_10043;
    }
}
