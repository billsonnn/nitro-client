import React from 'react';
import { useRoomStatus } from '../../hooks/room/useRoomStatus';
import { useSessionData } from '../../hooks/session/useSessionData';
import { AvatarEditor } from '../avatar/avatareditor';
import { Catalog } from '../catalog';
import { Inventory } from '../inventory';
import { Navigator } from '../navigator';
import { ToolbarView } from '../toolbar';
import { HotelView } from './hotelview';
import { RoomView } from './room';

export function DesktopView(): JSX.Element
{
    const [ navigatorShowing, setNavigatorShowing ] = React.useState(false);
    const [ inventoryShowing, setInventoryShowing ] = React.useState(false);
    const [ catalogShowing, setCatalogShowing ]     = React.useState(false);

    const roomStatus        = useRoomStatus();
    const sessionData       = useSessionData();
    const navigatorToggler  = () => setNavigatorShowing(!navigatorShowing);
    const inventoryToggler  = () => setInventoryShowing(!inventoryShowing);
    const catalogToggler    = () => setCatalogShowing(!catalogShowing);

    return (
        <div className="desktop-view">
            <ToolbarView
                roomStatus={ roomStatus }
                sessionData={ sessionData }
                navigatorToggler={ navigatorToggler }
                inventoryToggler={ inventoryToggler }
                catalogToggler={ catalogToggler }
            />
            { navigatorShowing && <Navigator /> }
            { inventoryShowing && <Inventory /> }
            { catalogShowing && <Catalog /> }
            <AvatarEditor figure={ sessionData.userFigure } />
            { roomStatus ? <RoomView /> : <HotelView sessionData={ sessionData } /> }
        </div>
    );
}