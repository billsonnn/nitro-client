import { IRoomSession } from '../IRoomSession';
import { RoomSessionEvent } from './RoomSessionEvent';

export class RoomSessionChatEvent extends RoomSessionEvent
{
    public static RSCE_CHAT_EVENT: string   = 'RSCE_CHAT_EVENT';
    public static RSCE_FLOOD_EVENT: string  = 'RSCE_FLOOD_EVENT';
    public static CHAT_NORMAL: number       = 0;
    public static CHAT_WHISPER: number      = 1;
    public static CHAT_SHOUT                = 2;

    private _objectId: number;
    private _message: string;
    private _chatType: number;
    private _style: number;

    constructor(type: string, session: IRoomSession, objectId: number, message: string, chatType: number, style: number)
    {
        super(type, session);

        this._objectId  = objectId;
        this._message   = message;
        this._chatType  = chatType;
        this._style     = style;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get message(): string
    {
        return this._message;
    }

    public get chatType(): number
    {
        return this._chatType;
    }

    public get style(): number
    {
        return this._style;
    }
}