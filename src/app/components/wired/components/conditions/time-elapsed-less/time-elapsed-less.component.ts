import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './time-elapsed-less.template.html'
})
export class TimeElapsedLessComponent extends WiredCondition
{
    public static CODE: number = WiredConditionType.TIME_ELAPSED_LESS;
    
    //private _slider:SliderWindowController;

    public get code(): number
    {
        return TimeElapsedLessComponent.CODE;
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     var _local_3: number = this._slider.getValue();
    //     _local_2.push((_local_3 + 1));
    //     return _local_2;
    // }

    public onInit(): void
    {
        // this._slider = new SliderWindowController(_arg_2, this._Str_2453(k), _arg_2.assets, 1, 1200, 1);
        // this._slider._Str_2526(1);
        // this._slider.addEventListener(Event.CHANGE, this.onSliderChange);
    }

    public onEditStart(trigger: Triggerable): void
    {
        const _local_3: number = (trigger.intData[0] - 1);
        //this._slider._Str_2526(_local_3);
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_2453(k:IWindowContainer):IWindowContainer
    // {
    //     return k.findChildByName("slider_container") as IWindowContainer;
    // }

    // private onSliderChange(k:Event): void
    // {
    //     var _local_2:SliderWindowController;
    //     var _local_3:Number;
    //     var _local_4: number;
    //     var _local_5: string;
    //     if (k.type == Event.CHANGE)
    //     {
    //         _local_2 = (k.target as SliderWindowController);
    //         if (_local_2)
    //         {
    //             _local_3 = _local_2.getValue();
    //             _local_4 = int(_local_3);
    //             _local_5 = TriggerOnce._Str_11919(_local_4);
    //             this._roomEvents.localization.registerParameter("wiredfurni.params.allowbefore", "seconds", _local_5);
    //         }
    //     }
    // }
}