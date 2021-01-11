import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './user-count-in.template.html'
})
export class UserCountInComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.USER_COUNT_IN;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_USER_COUNT_IN;

    //private _minSlider:SliderWindowController;
    //private _maxSlider:SliderWindowController;

    public get code(): number
    {
        return UserCountInComponent.CODE;
    }

    public get negativeCode(): number
    {
        return UserCountInComponent.NEGATIVE_CODE;
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     _local_2.push(this._minSlider.getValue());
    //     _local_2.push(this._maxSlider.getValue());
    //     return _local_2;
    // }

    public onInit(): void
    {
        // this._minSlider = new SliderWindowController(_arg_2, this._Str_23213(k), _arg_2.assets, 1, 50, 1);
        // this._minSlider.addEventListener(Event.CHANGE, this._Str_23138);
        // this._minSlider._Str_2526(1);
        // this._maxSlider = new SliderWindowController(_arg_2, this._Str_25609(k), _arg_2.assets, 1, 50, 1);
        // this._maxSlider.addEventListener(Event.CHANGE, this._Str_25837);
        // this._maxSlider._Str_2526(50);
    }

    public onEditStart(trigger: Triggerable): void
    {
        var _local_3: number = trigger.intData[0];
        var _local_4: number = trigger.intData[1];
        // this._minSlider._Str_2526(_local_3);
        // this._maxSlider._Str_2526(_local_4);
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_23213(k:IWindowContainer):IWindowContainer
    // {
    //     return k.findChildByName("min_slider_container") as IWindowContainer;
    // }

    // private _Str_25609(k:IWindowContainer):IWindowContainer
    // {
    //     return k.findChildByName("max_slider_container") as IWindowContainer;
    // }

    // private _Str_23138(k:Event): void
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
    //             this._roomEvents.localization.registerParameter("wiredfurni.params.usercountmin", "value", ("" + _local_4));
    //         }
    //     }
    // }

    // private _Str_25837(k:Event): void
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
    //             this._roomEvents.localization.registerParameter("wiredfurni.params.usercountmax", "value", ("" + _local_4));
    //         }
    //     }
    // }
}