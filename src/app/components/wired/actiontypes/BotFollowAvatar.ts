import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../components/main/main.component';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class BotFollowAvatar extends DefaultActionType
{
    public get code(): number
    {
        return ActionTypeCodes.BOT_FOLLOW_AVATAR;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5431;
    }

    // public readStringParamFromForm(k:IWindowContainer): string
    // {
    //     var _local_2: string = this._Str_2453(k, "bot_name").text;
    //     return _local_2;
    // }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     return [this._Str_4281(k, "type_selector")._Str_2657().id];
    // }

    public onEditStart(k: WiredMainComponent, _arg_2: Triggerable): void
    {
        // this._Str_2453(k, "bot_name").text = _arg_2.stringData;
        // this._Str_4281(k, "type_selector")._Str_2520(this._Str_10005(k, ("radio_" + _arg_2.intData[0])));
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_2453(k:IWindowContainer, _arg_2: string):ITextFieldWindow
    // {
    //     var _local_3:ITextFieldWindow = ITextFieldWindow(k.findChildByName(_arg_2));
    //     return _local_3;
    // }

    // private _Str_4281(k:IWindowContainer, _arg_2: string):ISelectorWindow
    // {
    //     return ISelectorWindow(k.findChildByName(_arg_2));
    // }

    // private _Str_10005(k:IWindowContainer, _arg_2: string):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName(_arg_2));
    // }
}