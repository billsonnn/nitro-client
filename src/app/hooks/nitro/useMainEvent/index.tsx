import { NitroEvent } from '../../../../core/events/NitroEvent';
import { Nitro } from '../../../../nitro/Nitro';
import { useNitroEvent } from '../useNitroEvent';

export function useMainEvent(type: string, handler: (event: NitroEvent) => void): void
{
    useNitroEvent(type, Nitro.instance.events, handler);
}