import { IConnection } from '../../../core/communication/connections/IConnection';
import { RespectReceivedEvent } from '../../communication/messages/incoming/notifications/RespectReceivedEvent';
import { RoomUnitChatEvent } from '../../communication/messages/incoming/room/unit/chat/RoomUnitChatEvent';
import { RoomUnitChatShoutEvent } from '../../communication/messages/incoming/room/unit/chat/RoomUnitChatShoutEvent';
import { RoomUnitChatWhisperEvent } from '../../communication/messages/incoming/room/unit/chat/RoomUnitChatWhisperEvent';
import { SystemChatStyleEnum } from '../../ui/widget/enums/SystemChatStyleEnum';
import { RoomSessionChatEvent } from '../events/RoomSessionChatEvent';
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
        connection.addMessageEvent(new RespectReceivedEvent(this.onRespectReceivedEvent.bind(this)));
    }

    private onRoomUnitChatEvent(event: RoomUnitChatEvent): void
    {
        if(!this.listener) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        const parser = event.getParser();

        if(!parser) return;

        let chatType: number = RoomSessionChatEvent.CHAT_NORMAL;

        if(event instanceof RoomUnitChatShoutEvent) chatType = RoomSessionChatEvent.CHAT_SHOUT;
        else if(event instanceof RoomUnitChatWhisperEvent) chatType = RoomSessionChatEvent.CHAT_WHISPER;

        const chatEvent = new RoomSessionChatEvent(RoomSessionChatEvent.CHAT_EVENT, session, parser.roomIndex, parser.message, chatType, parser.bubble);

        this.listener.events.dispatchEvent(chatEvent);
    }

    private onRespectReceivedEvent(event: RespectReceivedEvent): void
    {
        if(!this.listener) return;

        const session = this.listener.getSession(this.roomId);

        if(!session) return;

        const parser = event.getParser();

        if(!parser) return;

        const userData = session.userDataManager.getUserData(parser.userId);

        if(!userData) return;

        this.listener.events.dispatchEvent(new RoomSessionChatEvent(RoomSessionChatEvent.CHAT_EVENT, session, userData.roomIndex, '', RoomSessionChatEvent._Str_5821, SystemChatStyleEnum.GENERIC));
    }
}