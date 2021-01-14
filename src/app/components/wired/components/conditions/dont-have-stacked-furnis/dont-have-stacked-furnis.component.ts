import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../../main/main.component';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    template: 'DONT_HAVE_STACKED_FURNI'
})
export class DontHaveStackedFurnisComponent extends WiredCondition
{
    public static CODE: number = WiredConditionType.NOT_HAS_STACKED_FURNIS;

    public get code(): number
    {
        return DontHaveStackedFurnisComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4873;
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     _local_2.push(this._Str_11170(k)._Str_2657().id);
    //     return _local_2;
    // }

    public onEditStart(trigger: Triggerable): void
    {
        const _local_3: number = trigger.intData[0];
        //this._Str_11170(k)._Str_2520(this._Str_16683(k, _local_3));
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_16683(k:IWindowContainer, _arg_2: number):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName((("eval_" + _arg_2) + "_radio")));
    // }

    // private _Str_11170(k:IWindowContainer):ISelectorWindow
    // {
    //     return ISelectorWindow(k.findChildByName("eval_selector"));
    // }
}