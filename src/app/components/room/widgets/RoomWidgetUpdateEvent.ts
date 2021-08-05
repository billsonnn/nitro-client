import { NitroEvent } from '@nitrots/nitro-renderer/src/core/events/NitroEvent';

export class RoomWidgetUpdateEvent extends NitroEvent
{
    constructor(type: string)
    {
        super(type);
    }
}
