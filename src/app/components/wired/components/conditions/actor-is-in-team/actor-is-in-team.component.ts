import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './actor-is-in-team.template.html'
})
export class ActorIsInTeamComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.ACTOR_IS_IN_TEAM;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_ACTOR_IN_TEAM;

    public get code(): number
    {
        return ActorIsInTeamComponent.CODE;
    }

    public get negativeCode(): number
    {
        return ActorIsInTeamComponent.NEGATIVE_CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        const _local_3: number = trigger.intData[0];
        //this._Str_6616(k)._Str_2520(this._Str_9779(k, _local_3));
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     _local_2.push(this._Str_6616(k)._Str_2657().id);
    //     return _local_2;
    // }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_9779(k:IWindowContainer, _arg_2: number):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName((("team_" + _arg_2) + "_radio")));
    // }

    // private _Str_6616(k:IWindowContainer):ISelectorWindow
    // {
    //     return ISelectorWindow(k.findChildByName("team_selector"));
    // }
}