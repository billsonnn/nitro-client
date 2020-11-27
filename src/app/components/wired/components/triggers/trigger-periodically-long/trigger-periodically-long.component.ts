import { Component } from '@angular/core';
import { TriggerPeriodicallyComponent } from '../trigger-periodically/trigger-periodically.component';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: '../trigger-periodically/trigger-periodically.template.html'
})
export class TriggerPeriodicallyLongComponent extends TriggerPeriodicallyComponent
{
    public static CODE: number = WiredTriggerType.TRIGGER_PERIODICALLY_LONG;

    public get code(): number
    {
        return TriggerPeriodicallyLongComponent.CODE;
    }

    // protected onSliderChange(k:Event): void
    // {
    //     var _local_2:SliderWindowController;
    //     var _local_3:Number;
    //     var _local_4: string;
    //     if (k.type == Event.CHANGE)
    //     {
    //         _local_2 = (k.target as SliderWindowController);
    //         if (_local_2)
    //         {
    //             _local_3 = _local_2.getValue();
    //             _local_4 = FriendlyTime.format(_Str_16492.localization, (_local_3 * 5));
    //             _Str_16492.localization.registerParameter("wiredfurni.params.setlongtime", "time", _local_4);
    //         }
    //     }
    // }
}