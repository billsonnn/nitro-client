import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../../main/main.component';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './match-snapshot.template.html'
})
export class MatchSnapshotComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.STATES_MATCH;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_STATES_MATCH;

    public get code(): number
    {
        return MatchSnapshotComponent.CODE;
    }

    public get negativeCode(): number
    {
        return MatchSnapshotComponent.NEGATIVE_CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4873;
    }

    public get hasStateSnapshot(): boolean
    {
        return true;
    }

    public onEditStart(trigger: Triggerable): void
    {
        // this.select(this._Str_10847(k), _arg_2.getBoolean(0));
        // this.select(this._Str_10700(k), _arg_2.getBoolean(1));
        // this.select(this._Str_10629(k), _arg_2.getBoolean(2));
    }

    // private select(k:ICheckBoxWindow, _arg_2: boolean): void
    // {
    //     if (_arg_2)
    //     {
    //         k.select();
    //     }
    //     else
    //     {
    //         k._Str_2205();
    //     }
    // }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     _local_2.push(this._Str_7329(this._Str_10847(k)));
    //     _local_2.push(this._Str_7329(this._Str_10700(k)));
    //     _local_2.push(this._Str_7329(this._Str_10629(k)));
    //     return _local_2;
    // }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_10847(k:IWindowContainer):ICheckBoxWindow
    // {
    //     return ICheckBoxWindow(k.findChildByName("include_state_checkbox"));
    // }

    // private _Str_10700(k:IWindowContainer):ICheckBoxWindow
    // {
    //     return ICheckBoxWindow(k.findChildByName("include_rotation_checkbox"));
    // }

    // private _Str_10629(k:IWindowContainer):ICheckBoxWindow
    // {
    //     return ICheckBoxWindow(k.findChildByName("include_location_checkbox"));
    // }

    // private _Str_7329(k:ICheckBoxWindow): number
    // {
    //     return (k._Str_2365) ? 1 : 0;
    // }
}