import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';

export class RoomWidgetMeMenuMessage extends RoomWidgetMessage
{
    public static RWMMM_MESSAGE_ME_MENU_OPENED: string = 'RWMMM_MESSAGE_ME_MENU_OPENED';

    constructor(k: string)
    {
        super(k);
    }
}