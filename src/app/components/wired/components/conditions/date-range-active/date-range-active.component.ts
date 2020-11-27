import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './date-range-active.template.html'
})
export class DateRangeActiveComponent extends WiredCondition
{
    public static CODE: number = WiredConditionType.DATE_RANGE_ACTIVE;

    // private static getDate(k:IWindowContainer, _arg_2: string):Number
    // {
    //     return Date.parse(ITextFieldWindow(k.findChildByName(_arg_2)).text);
    // }

    public get code(): number
    {
        return DateRangeActiveComponent.CODE;
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_4:Number;
    //     var _local_2:Array = [];
    //     var _local_3:Number = getDate(k, "start_date");
    //     if (!isNaN(_local_3))
    //     {
    //         _local_2.push(int((_local_3 / 1000)));
    //         _local_4 = getDate(k, "end_date");
    //         if (!isNaN(_local_4))
    //         {
    //             _local_2.push(int((_local_4 / 1000)));
    //         }
    //     }
    //     return _local_2;
    // }

    public onEditStart(trigger: Triggerable): void
    {
        // var _local_4:Date;
        // var _local_5:Date;
        // var _local_3:DateTimeFormatter = new DateTimeFormatter("en-US");
        // _local_3.setDateTimePattern("yyyy/MM/dd HH:mm");
        // if (_arg_2.intData.length > 0)
        // {
        //     _local_4 = new Date((_arg_2.intData[0] * 1000));
        //     ITextFieldWindow(k.findChildByName("start_date")).text = _local_3.format(_local_4);
        // }
        // else
        // {
        //     ITextFieldWindow(k.findChildByName("start_date")).text = "";
        // }
        // if (_arg_2.intData.length > 1)
        // {
        //     _local_5 = new Date((_arg_2.intData[1] * 1000));
        //     ITextFieldWindow(k.findChildByName("end_date")).text = _local_3.format(_local_5);
        // }
        // else
        // {
        //     ITextFieldWindow(k.findChildByName("end_date")).text = "";
        // }
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}