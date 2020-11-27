import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../components/main/main.component';
import { WiredService } from '../services/wired.service';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class GiveScore extends DefaultActionType
{
    private _roomEvents: WiredService;
    //private _slider:SliderWindowController;
    //private _counterSlider:SliderWindowController;

    public get code(): number
    {
        return ActionTypeCodes.GIVE_SCORE;
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     _local_2.push(this._slider.getValue());
    //     _local_2.push(this._counterSlider.getValue());
    //     return _local_2;
    // }

    public onInit(k: WiredMainComponent, _arg_2: WiredService): void
    {
        this._roomEvents = _arg_2;
        // this._slider = new SliderWindowController(_arg_2, this._Str_2453(k), _arg_2.assets, 1, 100, 1);
        // this._slider.addEventListener(Event.CHANGE, this.onSliderChange);
        // this._slider._Str_2526(1);
        // this._counterSlider = new SliderWindowController(_arg_2, this._Str_22476(k), _arg_2.assets, 1, 10, 1);
        // this._counterSlider.addEventListener(Event.CHANGE, this._Str_24911);
        // this._counterSlider._Str_2526(1);
    }

    public onEditStart(k: WiredMainComponent, _arg_2: Triggerable): void
    {
        var _local_3: number = _arg_2.intData[0];
        var _local_4: number = _arg_2.intData[1];
        // this._slider._Str_2526(_local_3);
        // this._counterSlider._Str_2526(_local_4);
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_2453(k:IWindowContainer):IWindowContainer
    // {
    //     return k.findChildByName("slider_container") as IWindowContainer;
    // }

    // private _Str_22476(k:IWindowContainer):IWindowContainer
    // {
    //     return k.findChildByName("counter_slider_container") as IWindowContainer;
    // }

    // private onSliderChange(k:Event): void
    // {
    //     var _local_2:SliderWindowController;
    //     var _local_3:Number;
    //     var _local_4: number;
    //     if (k.type == Event.CHANGE)
    //     {
    //         _local_2 = (k.target as SliderWindowController);
    //         if (_local_2)
    //         {
    //             _local_3 = _local_2.getValue();
    //             _local_4 = int(_local_3);
    //             this._roomEvents.localization.registerParameter("wiredfurni.params.setpoints", "points", ("" + _local_4));
    //         }
    //     }
    // }

    // private _Str_24911(k:Event): void
    // {
    //     var _local_2:SliderWindowController;
    //     var _local_3:Number;
    //     var _local_4: number;
    //     if (k.type == Event.CHANGE)
    //     {
    //         _local_2 = (k.target as SliderWindowController);
    //         if (_local_2)
    //         {
    //             _local_3 = _local_2.getValue();
    //             _local_4 = int(_local_3);
    //             this._roomEvents.localization.registerParameter("wiredfurni.params.settimesingame", "times", ("" + _local_4));
    //         }
    //     }
    // }
}