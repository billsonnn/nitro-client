import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';

export class RoomWidgetDimmerChangeStateMessage extends RoomWidgetMessage
{
    public static RWCDSM_CHANGE_STATE: string = 'RWCDSM_CHANGE_STATE';

    constructor()
    {
        super(RoomWidgetDimmerChangeStateMessage.RWCDSM_CHANGE_STATE);
    }
}
