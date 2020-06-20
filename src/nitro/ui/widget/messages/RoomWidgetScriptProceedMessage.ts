import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetScriptProceedMessage extends RoomWidgetMessage
{
    public static RWPM_ANSWER: string = 'RWPM_ANSWER';

    constructor(k: string)
    {
        super(k);
    }
}