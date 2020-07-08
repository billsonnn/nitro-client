import React from 'react';
import { useRoomStatus } from '../../hooks/room/useRoomStatus';
import { HotelView } from './hotelview';
import { RoomView } from './room';

export function DesktopView(): JSX.Element
{
    const roomStatus = useRoomStatus();

    return (
        <div className="desktop-view">
            { roomStatus ? <RoomView /> : <HotelView /> }
        </div>
    );
}