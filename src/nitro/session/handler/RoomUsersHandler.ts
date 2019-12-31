import { IConnection } from '../../../core/communication/connections/IConnection';
import { RoomUnitEvent } from '../../communication/messages/incoming/room/unit/RoomUnitEvent';
import { IRoomHandlerListener } from '../IRoomHandlerListener';
import { BaseHandler } from './BaseHandler';

export class RoomUsersHandler extends BaseHandler
{
    constructor(connection: IConnection, listener: IRoomHandlerListener)
    {
        super(connection, listener);

        connection.addMessageEvent(new RoomUnitEvent(this.onRoomUnitEvent.bind(this)));
    }

    private onRoomUnitEvent(event: RoomUnitEvent): void
    {
        if(!(event instanceof RoomUnitEvent) || !this.listener) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        // add room user data to userdata manager in session
    }
}