import { Nitro } from '../../../../nitro/Nitro';
import { RoomEngineEvent } from '../../../../nitro/room/events/RoomEngineEvent';
import { useNitroEvent } from '../../nitro/useNitroEvent';

export function useRoomEngineEvent(type: string, handler: (event: RoomEngineEvent) => void): void
{
    useNitroEvent(type, Nitro.instance.roomEngine.events, handler);
}