import { Component } from '@angular/core';
import { WiredAction } from './../WiredAction';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredActionType } from '../WiredActionType';

@Component({
    templateUrl: './toggle-furni-state.template.html'
})
export class ToggleFurniStateComponent extends WiredAction
{
    public static CODE: number = WiredActionType.TOGGLE_FURNI_STATE;

    public get code(): number
    {
        return ToggleFurniStateComponent.CODE;
    }

    // public onEditStart(trigger: Triggerable): void
    // {

	// }

	public readIntegerParamsFromForm(): number[]
    {
        return [ ];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}
