import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { TriggerOnceComponent } from '../trigger-once/trigger-once.component';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './trigger-periodically.template.html'
})
export class TriggerPeriodicallyComponent extends WiredTrigger
{
    private static MINIMUM_VALUE: number = 1;
    private static MAXIMUM_VALUE: number = 120;
    private static STEPPER_VALUE: number = 1;

    public static CODE: number = WiredTriggerType.TRIGGER_PERIODICALLY;

    public time: number = 0;

    public get code(): number
    {
        return TriggerPeriodicallyComponent.CODE;
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

        if(this.time < TriggerPeriodicallyComponent.MINIMUM_VALUE) this.time = TriggerPeriodicallyComponent.MINIMUM_VALUE;
    }

    public increase(): void
    {
        this.time += 1;

        if(this.time > TriggerPeriodicallyComponent.MAXIMUM_VALUE) this.time = TriggerPeriodicallyComponent.MAXIMUM_VALUE;
    }

    protected updateLocaleParameter(): void
    {
        Nitro.instance.localization.registerParameter('wiredfurni.params.settime', 'seconds', TriggerOnceComponent.getLocaleName(this.time));

        this.updateCount++;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get sliderOptions(): Options
    {
        return {
            floor: TriggerPeriodicallyComponent.MINIMUM_VALUE,
            ceil: TriggerPeriodicallyComponent.MAXIMUM_VALUE,
            step: TriggerPeriodicallyComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}