import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './actor-is-wearing-effect.template.html'
})
export class ActorIsWearingEffectComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.ACTOR_IS_WEARING_EFFECT;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_ACTOR_WEARING_EFFECT;

    public get code(): number
    {
        return ActorIsWearingEffectComponent.CODE;
    }

    public get negativeCode(): number
    {
        return ActorIsWearingEffectComponent.NEGATIVE_CODE;
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = [];
    //     _local_2.push(int(this.getSpecialInputTextField(k).text));
    //     return _local_2;
    // }

    public onEditStart(trigger: Triggerable): void
    {
        //this.getSpecialInputTextField(k).text = _arg_2.intData[0];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private getSpecialInputTextField(k:IWindowContainer):ITextFieldWindow
    // {
    //     var _local_2:ITextFieldWindow = ITextFieldWindow(k.findChildByName("effect_id"));
    //     return _local_2;
    // }
}