import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../components/main/main.component';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class KickFromRoom extends DefaultActionType
{
    public get code(): number
    {
        return ActionTypeCodes.KICK_FROM_ROOM;
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
    //     var _local_2:ITextFieldWindow = ITextFieldWindow(k.findChildByName("chat_message"));
    //     return _local_2;
    // }

    // public validate(k:IWindowContainer, _arg_2:HabboUserDefinedRoomEvents): string
    // {
    //     var _local_4: string;
    //     var _local_3: number = 100;
    //     if (this._Str_2453(k).text.length > _local_3)
    //     {
    //         _local_4 = "wiredfurni.chatmsgtoolong";
    //         return _arg_2.localization.getLocalization(_local_4, _local_4);
    //     }
    //     return null;
    // }
}