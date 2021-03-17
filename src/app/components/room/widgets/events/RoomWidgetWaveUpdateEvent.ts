import { RoomWidgetUpdateEvent } from 'nitro-renderer/src/nitro/ui/widget/events/RoomWidgetUpdateEvent';

export class RoomWidgetWaveUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWUE_WAVE: string = 'RWUE_WAVE';

    constructor()
    {
        super(RoomWidgetWaveUpdateEvent.RWUE_WAVE);
    }
}
