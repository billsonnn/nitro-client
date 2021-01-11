import { Component } from '@angular/core';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { FriendlyTime } from '../../../../../../client/nitro/utils/FriendlyTime';
import { TriggerPeriodicallyComponent } from '../trigger-periodically/trigger-periodically.component';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './trigger-periodically-long.template.html'
})
export class TriggerPeriodicallyLongComponent extends TriggerPeriodicallyComponent
{
    public static CODE: number = WiredTriggerType.TRIGGER_PERIODICALLY_LONG;

    public get code(): number
    {
        return TriggerPeriodicallyLongComponent.CODE;
    }

    protected updateLocaleParameter(): void
    {
        Nitro.instance.localization.registerParameter('wiredfurni.params.setlongtime', 'time', FriendlyTime.format(this.time * 5));

        this.updateCount++;
    }
}