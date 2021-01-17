import { Options } from '@angular-slider/ngx-slider';
import { ActionDefinition } from 'src/client/nitro/communication/messages/incoming/roomevents/ActionDefinition';
import { Triggerable } from 'src/client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { Nitro } from 'src/client/nitro/Nitro';
import { WiredFurniture } from '../../WiredFurniture';

export class WiredAction extends WiredFurniture
{
    private static DELAY_MINIMUM_VALUE: number = 1;
    private static DELAY_MAXIMUM_VALUE: number = 20;
    private static DELAY_STEPPER_VALUE: number = 1;

    public updateCount: number = 0;
    public delay: number = 0;

    public onEditStart(trigger: Triggerable): void
    {
        const actionDefinition = trigger as any as ActionDefinition;
        this.delay = actionDefinition.delayInPulses;
        this.updateLocaleParameter();
    }

    public onSliderChange(): void
    {
        this.updateLocaleParameter();
    }

    public decreaseDelay(): void
    {
        this.delay -= 1;

        if(this.delay < WiredAction.DELAY_MINIMUM_VALUE) this.delay = WiredAction.DELAY_MINIMUM_VALUE;
    }

    public increaseDelay(): void
    {
        this.delay += 1;

        if(this.delay > WiredAction.DELAY_MAXIMUM_VALUE) this.delay = WiredAction.DELAY_MAXIMUM_VALUE;
    }

    protected updateLocaleParameter(): void
    {
        Nitro.instance.localization.registerParameter('wiredfurni.params.delay', 'seconds', WiredFurniture.getLocaleName(this.delay));

        this.updateCount++;
    }

    public get delaySliderOptions(): Options
    {
        return {
            floor: WiredAction.DELAY_MINIMUM_VALUE,
            ceil: WiredAction.DELAY_MAXIMUM_VALUE,
            step: WiredAction.DELAY_STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
