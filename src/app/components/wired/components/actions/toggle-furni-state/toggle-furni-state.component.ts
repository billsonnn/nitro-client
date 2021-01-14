import { ActionDefinition } from './../../../../../../client/nitro/communication/messages/incoming/roomevents/ActionDefinition';
import { WiredFurniture } from './../../../WiredFurniture';
import { Component } from '@angular/core';
import { WiredAction } from './../WiredAction';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredActionType } from '../WiredActionType';
import { WiredMainComponent } from '../../main/main.component';
import { Nitro } from 'src/client/nitro/Nitro';
import { Options } from '@angular-slider/ngx-slider';

@Component({
    templateUrl: './toggle-furni-state.template.html'
})
export class ToggleFurniStateComponent extends WiredAction
{
    public static CODE: number = WiredActionType.TOGGLE_FURNI_STATE;

	private static MINIMUM_VALUE: number = 1;
    private static MAXIMUM_VALUE: number = 20;
	private static STEPPER_VALUE: number = 1;

    public get code(): number
    {
        return ToggleFurniStateComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
		const actionDefinition = trigger as any as ActionDefinition;
		this.delay = actionDefinition._Str_25459;
	}

	public readIntegerParamsFromForm(): number[]
    {
        return [ this.delay ];
	}

	public onSliderChange(): void
    {
        this.updateLocaleParameter();
    }

    public decrease(): void
    {
        this.delay -= 1;

        if(this.delay < ToggleFurniStateComponent.MINIMUM_VALUE) this.delay = ToggleFurniStateComponent.MINIMUM_VALUE;
    }

    public increase(): void
    {
        this.delay += 1;

        if(this.delay > ToggleFurniStateComponent.MAXIMUM_VALUE) this.delay = ToggleFurniStateComponent.MAXIMUM_VALUE;
    }

    protected updateLocaleParameter(): void
    {
        Nitro.instance.localization.registerParameter('wiredfurni.params.delay', 'seconds', WiredFurniture.getLocaleName(this.delay));

        this.updateCount++;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
	}

	public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4873;
	}

	public get sliderOptions(): Options
    {
        return {
            floor: ToggleFurniStateComponent.MINIMUM_VALUE,
            ceil: ToggleFurniStateComponent.MAXIMUM_VALUE,
            step: ToggleFurniStateComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
