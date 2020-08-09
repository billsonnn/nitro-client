import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';

export class RoomWidgetPlayListUserActionMessage extends RoomWidgetMessage
{
    public static RWPLUA_OPEN_CATALOGUE_BUTTON_PRESSED: string = 'RWPLUA_OPEN_CATALOGUE_BUTTON_PRESSED';

    constructor(k: string)
    {
        super(k);
    }
}