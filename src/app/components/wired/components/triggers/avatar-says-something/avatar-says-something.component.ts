import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './avatar-says-something.template.html'
})
export class AvatarSaysSomethingComponent extends WiredTrigger
{
    public static CODE: number = WiredTriggerType.AVATAR_SAYS_SOMETHING;

    public get code(): number
    {
        return AvatarSaysSomethingComponent.CODE;
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     _local_2.push(((this._Str_20767(k)._Str_2365) ? 1 : 0));
    //     return _local_2;
    // }

    // public readStringParamFromForm(k:IWindowContainer): string
    // {
    //     return this._Str_2453(k).text;
    // }

    public onInitStart(): void
    {
        // k.findChildByName("me_txt").caption = _arg_2.userName;
    }

    public onEditStart(trigger: Triggerable): void
    {
        // this._Str_2453(k).text = _arg_2.stringData;
        // if (((_arg_2.intData.length > 0) && (_arg_2.intData[0] == 1)))
        // {
        //     this._Str_4281(k)._Str_2520(this._Str_20767(k));
        // }
        // else
        // {
        //     this._Str_4281(k)._Str_2520(this._Str_16153(k));
        // }
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_2453(k:IWindowContainer):ITextFieldWindow
    // {
    //     var _local_2:ITextFieldWindow = ITextFieldWindow(k.findChildByName("chat_txt"));
    //     return _local_2;
    // }

    // private _Str_16153(k:IWindowContainer):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName("any_avatar_radio"));
    // }

    // private _Str_20767(k:IWindowContainer):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName("me_radio"));
    // }

    // private _Str_4281(k:IWindowContainer):ISelectorWindow
    // {
    //     return ISelectorWindow(k.findChildByName("avatar_radio"));
    // }
}