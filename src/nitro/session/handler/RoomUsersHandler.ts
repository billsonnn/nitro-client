import { IConnection } from '../../../core/communication/connections/IConnection';
import { RoomUnitEvent } from '../../communication/messages/incoming/room/unit/RoomUnitEvent';
import { RoomUnitInfoEvent } from '../../communication/messages/incoming/room/unit/RoomUnitInfoEvent';
import { RoomUnitRemoveEvent } from '../../communication/messages/incoming/room/unit/RoomUnitRemoveEvent';
import { IRoomHandlerListener } from '../IRoomHandlerListener';
import { RoomUserData } from '../RoomUserData';
import { BaseHandler } from './BaseHandler';

export class RoomUsersHandler extends BaseHandler
{
    constructor(connection: IConnection, listener: IRoomHandlerListener)
    {
        super(connection, listener);

        connection.addMessageEvent(new RoomUnitEvent(this.onRoomUnitEvent.bind(this)));
        connection.addMessageEvent(new RoomUnitInfoEvent(this.onRoomUnitInfoEvent.bind(this)));
        connection.addMessageEvent(new RoomUnitRemoveEvent(this.onRoomUnitRemoveEvent.bind(this)));
    }

    private onRoomUnitEvent(event: RoomUnitEvent): void
    {
        if(!(event instanceof RoomUnitEvent) || !this.listener) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        const units = event.getParser().units;

        const unitsToAdd: RoomUserData[] = [];

        if(units && units.length)
        {
            for(let unit of units)
            {
                if(!unit) continue;

                const userData = new RoomUserData(unit.unitId);

                userData.id     = unit.id;
                userData.name   = unit.username;
                userData.type   = unit.type;
                userData.gender = unit.gender;
                userData.figure = unit.figure;
                userData.motto  = unit.motto;

                if(!session.userData.getUserData(userData.id)) unitsToAdd.push(userData);

                session.userData.updateUserData(userData);
            }
        }
    }

    private onRoomUnitInfoEvent(event: RoomUnitInfoEvent): void
    {
        if(!(event instanceof RoomUnitInfoEvent) || !this.listener) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        const parser = event.getParser();

        if(!parser) return;

        session.userData.updateFigure(parser.unitId, parser.figure, parser.gender);
        session.userData.updateMotto(parser.unitId, parser.motto);
    }

    private onRoomUnitRemoveEvent(event: RoomUnitRemoveEvent): void
    {
        if(!(event instanceof RoomUnitRemoveEvent) || !this.listener) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        session.userData.removeUserData(event.getParser().unitId);
    }
}