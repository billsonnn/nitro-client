import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { Nitro } from 'src/client/nitro/Nitro';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { TriggerOnceComponent } from '../../triggers/trigger-once/trigger-once.component';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './time-elapsed-more.template.html'
})
export class TimeElapsedMoreComponent extends WiredCondition
{
    public static CODE: number = WiredConditionType.TIME_ELAPSED_MORE;

    private static MINIMUM_VALUE: number = 1;
    private static MAXIMUM_VALUE: number = 1200;
    private static STEPPER_VALUE: number = 1;

	public time: number = 0;

    public get code(): number
    {
        return TimeElapsedMoreComponent.CODE;
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

        if(this.time < TimeElapsedMoreComponent.MINIMUM_VALUE) this.time = TimeElapsedMoreComponent.MINIMUM_VALUE;
    }

    public increase(): void
    {
        this.time += 1;

        if(this.time > TimeElapsedMoreComponent.MAXIMUM_VALUE) this.time = TimeElapsedMoreComponent.MAXIMUM_VALUE;
    }

    protected updateLocaleParameter(): void
    {
        Nitro.instance.localization.registerParameter('wiredfurni.params.allowafter', 'seconds', TriggerOnceComponent.getLocaleName(this.time));

        this.updateCount++;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get sliderOptions(): Options
    {
        return {
            floor: TimeElapsedMoreComponent.MINIMUM_VALUE,
            ceil: TimeElapsedMoreComponent.MAXIMUM_VALUE,
            step: TimeElapsedMoreComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
