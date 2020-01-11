import { IConnection } from '../../../core/communication/connections/IConnection';
import { RoomUnitChatEvent } from '../../communication/messages/incoming/room/unit/chat/RoomUnitChatEvent';
import { RoomUnitChatShoutEvent } from '../../communication/messages/incoming/room/unit/chat/RoomUnitChatShoutEvent';
import { RoomUnitChatWhisperEvent } from '../../communication/messages/incoming/room/unit/chat/RoomUnitChatWhisperEvent';
import { IRoomHandlerListener } from '../IRoomHandlerListener';
import { BaseHandler } from './BaseHandler';

export class RoomChatHandler extends BaseHandler
{
    constructor(connection: IConnection, listener: IRoomHandlerListener)
    {
        super(connection, listener);

        connection.addMessageEvent(new RoomUnitChatEvent(this.onRoomUnitChatEvent.bind(this)));
        connection.addMessageEvent(new RoomUnitChatShoutEvent(this.onRoomUnitChatEvent.bind(this)));
        connection.addMessageEvent(new RoomUnitChatWhisperEvent(this.onRoomUnitChatEvent.bind(this)));
    }

    private onRoomUnitChatEvent(event: RoomUnitChatEvent): void
    {
        if(!(event instanceof RoomUnitChatEvent) || !this.listener) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        console.log('chat');
    }
}