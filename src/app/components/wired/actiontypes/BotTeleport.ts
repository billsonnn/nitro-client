import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../components/main/main.component';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class BotTeleport extends DefaultActionType
{
    public get code(): number
    {
        return ActionTypeCodes.BOT_TELEPORT;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4873;
    }

    // public readStringParamFromForm(k:IWindowContainer): string
    // {
    //     var _local_2: string = this._Str_2453(k).text;
    //     return _local_2;
    // }

    public onEditStart(k: WiredMainComponent, _arg_2: Triggerable): void
    {
        //this._Str_2453(k).text = _arg_2.stringData;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_2453(k:IWindowContainer):ITextFieldWindow
    // {
    //     var _local_2:ITextFieldWindow = ITextFieldWindow(k.findChildByName("bot_name"));
    //     return _local_2;
    // }
}