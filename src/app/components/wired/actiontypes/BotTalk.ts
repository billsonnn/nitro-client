import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../components/main/main.component';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class BotTalk extends DefaultActionType
{
    private static _Str_4332: string = '\t';

    public get code(): number
    {
        return ActionTypeCodes.BOT_TALK;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5431;
    }

    // public readStringParamFromForm(k:IWindowContainer): string
    // {
    //     var _local_2: string = this._Str_2453(k, "bot_name").text;
    //     var _local_3: string = this._Str_2453(k, "chat_message").text;
    //     return (_local_2 + BotTalk._Str_4332) + _local_3;
    // }

    public onEditStart(k: WiredMainComponent, _arg_2: Triggerable): void
    {
        const _local_3 = _arg_2.stringData.split(BotTalk._Str_4332);
        // this._Str_2453(k, "bot_name").text = ((_local_3.length >= 1) ? _local_3[0] : "");
        // this._Str_2453(k, "chat_message").text = ((_local_3.length == 2) ? _local_3[1] : "");
        // this._Str_4281(k, "type_selector")._Str_2520(this._Str_10005(k, ("radio_" + _arg_2.intData[0])));
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     return [this._Str_4281(k, "type_selector")._Str_2657().id];
    // }

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