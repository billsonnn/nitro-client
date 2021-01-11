import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './actor-wears-badge.template.html'
})
export class ActorWearsBadgeComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.ACTOR_IS_WEARING_BADGE;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_ACTOR_WEARS_BADGE;

    public get code(): number
    {
        return ActorWearsBadgeComponent.CODE;
    }

    public get negativeCode(): number
    {
        return ActorWearsBadgeComponent.NEGATIVE_CODE;
    }

    // public readStringParamFromForm(k:IWindowContainer): string
    // {
    //     var _local_2: string = this._Str_2453(k).text;
    //     return _local_2;
    // }

    public onEditStart(trigger: Triggerable): void
    {
        //this._Str_2453(k).text = _arg_2.stringData;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_2453(k:IWindowContainer):ITextFieldWindow
    // {
    //     var _local_2:ITextFieldWindow = ITextFieldWindow(k.findChildByName("badge_code"));
    //     return _local_2;
    // }
}