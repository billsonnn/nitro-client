import { RoomWidgetMessage } from 'nitro-renderer/src/nitro/ui/widget/messages/RoomWidgetMessage';

export class RoomWidgetGetSettingsMessage extends RoomWidgetMessage
{
    public static RWGSM_GET_SETTINGS: string = 'RWGSM_GET_SETTINGS';

    constructor(k: string)
    {
        super(k);
    }
}
