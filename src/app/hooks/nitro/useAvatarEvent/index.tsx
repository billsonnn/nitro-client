import { NitroEvent } from '../../../../core/events/NitroEvent';
import { Nitro } from '../../../../nitro/Nitro';
import { useNitroEvent } from '../useNitroEvent';

export function useAvatarEvent(type: string, handler: (event: NitroEvent) => void): void
{
    useNitroEvent(type, Nitro.instance.avatar.events, handler);
}