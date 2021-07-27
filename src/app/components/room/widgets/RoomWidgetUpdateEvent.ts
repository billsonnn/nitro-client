import { NitroEvent } from 'nitro-renderer/src/core/events/NitroEvent';

export class RoomWidgetUpdateEvent extends NitroEvent
{
    constructor(type: string)
    {
        super(type);
    }
}
