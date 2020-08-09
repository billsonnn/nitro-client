import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';

export class RoomWidgetShowPlaceholderEvent extends RoomWidgetUpdateEvent
{
    public static RWSPE_SHOW_PLACEHOLDER: string = 'RWSPE_SHOW_PLACEHOLDER';

    constructor(k: string)
    {
        super(k);
    }
}