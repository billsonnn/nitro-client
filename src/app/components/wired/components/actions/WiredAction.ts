import { ActionDefinition } from 'nitro-renderer/src/nitro/communication/messages/incoming/roomevents/ActionDefinition';
import { Triggerable } from 'nitro-renderer/src/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredFurniture } from '../../WiredFurniture';

export class WiredAction extends WiredFurniture
{
    public delay: number = 0;

    public onEditStart(trigger: Triggerable): void
    {
        this.delay = (trigger as ActionDefinition).delayInPulses;
    }
}
