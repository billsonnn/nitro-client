﻿import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetMeMenuMessage extends RoomWidgetMessage
{
    public static RWMMM_MESSAGE_ME_MENU_OPENED: string = 'RWMMM_MESSAGE_ME_MENU_OPENED';

    constructor(k: string)
    {
        super(k);
    }
}