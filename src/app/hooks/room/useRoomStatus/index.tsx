import React from 'react';
import { RoomEngineEvent } from '../../../../nitro/room/events/RoomEngineEvent';
import { useRoomEngineEvent } from '../useRoomEngineEvent';

export function useRoomStatus(): boolean
{
    const [ roomStatus, setRoomStatus ] = React.useState(false);

    const handler = React.useCallback((event: RoomEngineEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                setRoomStatus(true);
                break;
            case RoomEngineEvent.DISPOSED:
                setRoomStatus(false);
                break;
        }
    }, [ setRoomStatus ]);

    useRoomEngineEvent(RoomEngineEvent.INITIALIZED, handler);
    useRoomEngineEvent(RoomEngineEvent.DISPOSED, handler);

    return roomStatus;
}