import { MessengerChat } from './MessengerChat';

export class MessengerThread
{
    private _participantId: number;
    private _chats: MessengerChat[];

    constructor(participantId: number)
    {
        this._participantId = -1;
        this._chats         = [];
    }

    public insertChat(senderId: number, message: string, secondsSinceSent: number, extraData: string, type: number = 0): MessengerChat
    {
        const chat = new MessengerChat(senderId, message, secondsSinceSent, extraData, type);

        this._chats.push(chat);

        return chat;
    }

    public get participantId(): number
    {
        return this._participantId;
    }

    public get chats(): MessengerChat[]
    {
        return this._chats;
    }
}