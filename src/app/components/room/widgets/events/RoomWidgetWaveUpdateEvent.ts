import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';

export class RoomWidgetWaveUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWUE_WAVE: string = 'RWUE_WAVE';

    constructor()
    {
        super(RoomWidgetWaveUpdateEvent.RWUE_WAVE);
    }
}