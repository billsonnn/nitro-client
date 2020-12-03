import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './trigger-once.template.html'
})
export class TriggerOnceComponent extends WiredTrigger
{
    private static MINIMUM_VALUE: number = 1;
    private static MAXIMUM_VALUE: number = 1200;
    private static STEPPER_VALUE: number = 1;

    public static CODE: number = WiredTriggerType.TRIGGER_ONCE;

    public time: number = 0;
    public fakeUpdate: number = 0;

    public static getLocaleName(value: number): string
    {
        const time = Math.floor((value / 2));
        
        if(!(value % 2)) return time.toString();

        return (time + 0.5).toString();
    }

    public get code(): number
    {
        return TriggerOnceComponent.CODE;
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

        if(this.time < TriggerOnceComponent.MINIMUM_VALUE) this.time = TriggerOnceComponent.MINIMUM_VALUE;
    }

    public increase(): void
    {
        this.time += 1;

        if(this.time > TriggerOnceComponent.MAXIMUM_VALUE) this.time = TriggerOnceComponent.MAXIMUM_VALUE;
    }

    private updateLocaleParameter(): void
    {
        Nitro.instance.localization.registerParameter('wiredfurni.params.settime', 'seconds', TriggerOnceComponent.getLocaleName(this.time));

        this.fakeUpdate++;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get sliderOptions(): Options
    {
        return {
            floor: TriggerOnceComponent.MINIMUM_VALUE,
            ceil: TriggerOnceComponent.MAXIMUM_VALUE,
            step: TriggerOnceComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}