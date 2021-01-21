import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../components/main/main.component';
import { WiredService } from '../services/wired.service';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class MoveToDirection extends DefaultActionType
{
    public get code(): number
    {
        return ActionTypeCodes.MOVE_TO_DIRECTION;
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
    }

    public onEditStart(k: WiredMainComponent, _arg_2: Triggerable): void
    {
        const _local_3: number = _arg_2.intData[0];
        const _local_4: number = _arg_2.intData[1];
        // this._Str_22058(k)._Str_2520(this._Str_24927(k, _local_3));
        // this._Str_21411(k)._Str_2520(this._Str_22820(k, _local_4));
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     _local_2.push(this._Str_22058(k)._Str_2657().id);
    //     _local_2.push(this._Str_21411(k)._Str_2657().id);
    //     return _local_2;
    // }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_24927(k:IWindowContainer, _arg_2: number):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName((("startdir_" + _arg_2) + "_radio")));
    // }

    // private _Str_22820(k:IWindowContainer, _arg_2: number):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName((("turn_" + _arg_2) + "_radio")));
    // }

    // private _Str_22058(k:IWindowContainer):ISelectorWindow
    // {
    //     return ISelectorWindow(k.findChildByName("startdir_selector"));
    // }

    // private _Str_21411(k:IWindowContainer):ISelectorWindow
    // {
    //     return ISelectorWindow(k.findChildByName("turn_selector"));
    // }
}