import { RoomWidgetMessage } from 'nitro-renderer/src/nitro/ui/widget/messages/RoomWidgetMessage';

export class RoomWidgetShowOwnRoomsMessage extends RoomWidgetMessage
{
    public static RWSORM_SHOW_OWN_ROOMS: string = 'RWSORM_SHOW_OWN_ROOMS';

    constructor()
    {
        super(RoomWidgetShowOwnRoomsMessage.RWSORM_SHOW_OWN_ROOMS);
    }
}
