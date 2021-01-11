import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';

export class RoomWidgetStopEffectMessage extends RoomWidgetMessage
{
    public static RWGOI_MESSAGE_STOP_EFFECT: string = 'RWGOI_MESSAGE_STOP_EFFECT';

    constructor()
    {
        super(RoomWidgetStopEffectMessage.RWGOI_MESSAGE_STOP_EFFECT);
    }
}