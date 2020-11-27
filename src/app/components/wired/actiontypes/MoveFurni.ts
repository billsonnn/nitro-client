import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../components/main/main.component';
import { WiredService } from '../services/wired.service';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class MoveFurni extends DefaultActionType
{
    public get code(): number
    {
        return ActionTypeCodes.MOVE_FURNI;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5430;
    }

    public onInit(k: WiredMainComponent, _arg_2: WiredService): void
    {
        // _arg_2.refreshButton(k, "move_0", true, null, 0);
        // _arg_2.refreshButton(k, "move_2", true, null, 0);
        // _arg_2.refreshButton(k, "move_4", true, null, 0);
        // _arg_2.refreshButton(k, "move_6", true, null, 0);
        // _arg_2.refreshButton(k, "move_diag", true, null, 0);
        // _arg_2.refreshButton(k, "move_rnd", true, null, 0);
        // _arg_2.refreshButton(k, "move_vrt", true, null, 0);
        // _arg_2.refreshButton(k, "rotate_ccw", true, null, 0);
        // _arg_2.refreshButton(k, "rotate_cw", true, null, 0);
    }

    public onEditStart(k: WiredMainComponent, _arg_2: Triggerable): void
    {
        var _local_3: number = _arg_2.intData[0];
        var _local_4: number = _arg_2.intData[1];
        // this._Str_19968(k)._Str_2520(this._Str_25584(k, _local_3));
        // this._Str_21784(k)._Str_2520(this._Str_23005(k, _local_4));
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     var _local_3: number = this._Str_19968(k)._Str_2657().id;
    //     var _local_4: number = this._Str_21784(k)._Str_2657().id;
    //     _local_2.push(_local_3);
    //     _local_2.push(_local_4);
    //     return _local_2;
    // }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_25584(k:IWindowContainer, _arg_2: number):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName((("move_" + _arg_2) + "_radio")));
    // }

    // private _Str_23005(k:IWindowContainer, _arg_2: number):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName((("rotate_" + _arg_2) + "_radio")));
    // }

    // private _Str_19968(k:IWindowContainer):ISelectorWindow
    // {
    //     return ISelectorWindow(k.findChildByName("move_selector"));
    // }

    // private _Str_21784(k:IWindowContainer):ISelectorWindow
    // {
    //     return ISelectorWindow(k.findChildByName("rotate_selector"));
    // }
}