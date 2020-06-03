import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetChatMessage extends RoomWidgetMessage
{
    public static MESSAGE_CHAT: string = 'RWCM_MESSAGE_CHAT';

    private _chatType: number;
    private _text: string;
    private _recipientName: string;
    private _styleId: number;

    constructor(type: string, text: string, chatType: number, recipientName: string, styleId: number)
    {
        super(type);

        this._text          = text;
        this._chatType      = chatType;
        this._recipientName = recipientName;
        this._styleId       = styleId;
    }

    public get text(): string
    {
        return this._text;
    }

    public get chatType(): number
    {
        return this._chatType;
    }

    public get recipientName(): string
    {
        return this._recipientName;
    }

    public get styleId(): number
    {
        return this._styleId;
    }
}