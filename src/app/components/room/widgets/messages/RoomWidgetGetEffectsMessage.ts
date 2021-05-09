import { RoomWidgetMessage } from 'nitro-renderer/src/nitro/ui/widget/messages/RoomWidgetMessage';

export class RoomWidgetGetEffectsMessage extends RoomWidgetMessage
{
    public static RWCM_MESSAGE_GET_EFFECTS: string = 'RWCM_MESSAGE_GET_EFFECTS';

    constructor()
    {
        super(RoomWidgetGetEffectsMessage.RWCM_MESSAGE_GET_EFFECTS);
    }
}
