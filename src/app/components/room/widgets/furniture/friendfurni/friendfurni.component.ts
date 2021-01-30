import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { IRoomWidgetHandler } from '../../../../../../client/nitro/ui/IRoomWidgetHandler';

export class FriendFurniEngravingWidget extends ConversionTrackingWidget
{
    private _furniId: number = -1;
    // private _engravingView: FriendFurniEngravingView;

    constructor(handler: IRoomWidgetHandler)
    {
        super();
        this.widgetHandler = handler;
        // this._Str_11963.widget = this;
    }

    public get furniId(): number
    {
        return this._furniId;
    }

    public get _Str_11963(): FriendFurniEngravingWidgetHandler
    {
        return _Str_2470 as FriendFurniEngravingWidgetHandler;
    }

    public open(furniId: number, _arg_2:int, _arg_3:StringArrayStuffData):void
    {
        this.close(this._furniId);
        this._furniId = furniId;
        switch (_arg_2)
        {
            case FriendFurniEngravingWidgetTypeEnum._Str_13451:
                this._engravingView = new LoveLockEngravingView(this, _arg_3);
                break;
            case FriendFurniEngravingWidgetTypeEnum._Str_17498:
                break;
            case FriendFurniEngravingWidgetTypeEnum._Str_18746:
                break;
            case FriendFurniEngravingWidgetTypeEnum._Str_15230:
                this._engravingView = new WildWestEngravingView(this, _arg_3);
                break;
            case FriendFurniEngravingWidgetTypeEnum._Str_15778:
                this._engravingView = new HabboweenEngravingView(this, _arg_3);
                break;
        }
        this._engravingView.open();
    }

    public close(furniId: number): void
    {
        if (((furniId == this._furniId) && (this._engravingView)))
        {
            this._engravingView.dispose();
            this._engravingView = null;
            this._furniId = -1;
        }
    }
}
