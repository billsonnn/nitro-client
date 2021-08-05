import { RoomWidgetMessage } from '@nitrots/nitro-renderer/src/nitro/ui/widget/messages/RoomWidgetMessage';

export class RoomWidgetScriptProceedMessage extends RoomWidgetMessage
{
    public static RWPM_ANSWER: string = 'RWPM_ANSWER';

    constructor(k: string)
    {
        super(k);
    }
}
