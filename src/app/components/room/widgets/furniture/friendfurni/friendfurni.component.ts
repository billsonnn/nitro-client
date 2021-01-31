import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { Component } from '@angular/core';
import { FriendFurniEngravingWidgetType } from '../../../../../../client/nitro/room/enums/FriendFurniEngravingWidgetType';

@Component({
    templateUrl: './engraving.template.html'
})
export class FriendFurniEngravingWidget extends ConversionTrackingWidget
{
    private _furniId: number = -1;
    public engravingView: string = null;
    public visible: boolean = false;
    constructor()
    {
        super();
    }


    public open(furniId: number, _arg_2:number, _arg_3:object):void
    {
        this.close(this._furniId);
        this._furniId = furniId;
        switch(_arg_2)
        {
            case FriendFurniEngravingWidgetType._Str_13451:
                this.engravingView = 'love';
                break;
            case FriendFurniEngravingWidgetType._Str_17498:
                break;
            case FriendFurniEngravingWidgetType._Str_18746:
                break;
            case FriendFurniEngravingWidgetType._Str_15230:
                this.engravingView = 'wild-west';
                break;
            case FriendFurniEngravingWidgetType._Str_15778:
                this.engravingView = 'habboween';
                break;
        }

    }

    public close(furniId: number): void
    {
        // if(((furniId == this._furniId) && (this._engravingView)))
        // {
        //     this._engravingView.dispose();
        //     this._engravingView = null;
        //     this._furniId = -1;
        // }
    }
}
