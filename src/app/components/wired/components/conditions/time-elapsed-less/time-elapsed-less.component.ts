import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { Nitro } from 'src/client/nitro/Nitro';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { TriggerOnceComponent } from '../../triggers/trigger-once/trigger-once.component';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './time-elapsed-less.template.html'
})
export class TimeElapsedLessComponent extends WiredCondition
{
    public static CODE: number = WiredConditionType.TIME_ELAPSED_LESS;

    private static MINIMUM_VALUE: number = 1;
    private static MAXIMUM_VALUE: number = 1200;
    private static STEPPER_VALUE: number = 1;

	public time: number = 0;

    public get code(): number
    {
        return TimeElapsedLessComponent.CODE;
    }

	public onEditStart(trigger: Triggerable): void
    {
        this.time = (trigger.intData[0] || 1);

        this.updateLocaleParameter();
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ this.time ];
    }

    public onSliderChange(): void
    {
        this.updateLocaleParameter();
    }

    public decrease(): void
    {
        this.time -= 1;

        if(this.time < TimeElapsedLessComponent.MINIMUM_VALUE) this.time = TimeElapsedLessComponent.MINIMUM_VALUE;
    }

    public increase(): void
    {
        this.time += 1;

        if(this.time > TimeElapsedLessComponent.MAXIMUM_VALUE) this.time = TimeElapsedLessComponent.MAXIMUM_VALUE;
    }

    protected updateLocaleParameter(): void
    {
        Nitro.instance.localization.registerParameter('wiredfurni.params.allowbefore', 'seconds', TriggerOnceComponent.getLocaleName(this.time));

        this.updateCount++;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get sliderOptions(): Options
    {
        return {
            floor: TimeElapsedLessComponent.MINIMUM_VALUE,
            ceil: TimeElapsedLessComponent.MAXIMUM_VALUE,
            step: TimeElapsedLessComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
