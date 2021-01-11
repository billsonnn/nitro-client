import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../components/main/main.component';
import { ActionTypeCodes } from './ActionTypeCodes';
import { GiveScore } from './GiveScore';

export class GiveScoreToPredefinedTeam extends GiveScore
{
    public get code(): number
    {
        return ActionTypeCodes.GIVE_SCORE_TO_PREDEFINED_TEAM;
    }

    public onEditStart(k: WiredMainComponent, _arg_2: Triggerable): void
    {
        super.onEditStart(k, _arg_2);
        // var _local_3: number = _arg_2.intData[2];
        // this._Str_6616(k)._Str_2520(this._Str_9779(k, _local_3));
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = super.readIntegerParamsFromForm(k);
    //     _local_2.push(this._Str_6616(k)._Str_2657().id);
    //     return _local_2;
    // }

    // private _Str_9779(k:IWindowContainer, _arg_2: number):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName((("team_" + _arg_2) + "_radio")));
    // }

    // private _Str_6616(k:IWindowContainer):ISelectorWindow
    // {
    //     return ISelectorWindow(k.findChildByName("team_selector"));
    // }
}