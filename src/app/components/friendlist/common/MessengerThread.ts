import { MessengerChat } from './MessengerChat';
import { MessengerFriend } from './MessengerFriend';
import { RelationshipStatusEnum } from './RelationshipStatusEnum';

export class MessengerThread
{
    private _participantSelf: MessengerFriend;
    private _participantOther: MessengerFriend;
    private _chats: MessengerChat[];

    constructor(participantSelf: MessengerFriend, participantOther: MessengerFriend)
    {
        this._participantSelf   = participantSelf;
        this._participantOther  = participantOther;
        this._chats             = [];
    }

    public insertChat(senderId: number, message: string, secondsSinceSent: number, extraData: string, type: number = 0): MessengerChat
    {
        let participant: MessengerFriend = null;

        if(senderId === this._participantOther.id)
        {
            participant = this._participantOther;
        }
        else
        {
            participant = this._participantSelf;
        }

        const chat = new MessengerChat(participant, message, secondsSinceSent, extraData, type);

        this._chats.push(chat);

        return chat;
    }

    public get participantSelf(): MessengerFriend
    {
        return this._participantSelf;
    }

    public get participantOther(): MessengerFriend
    {
        return this._participantOther;
    }

    public get chats(): MessengerChat[]
    {
        return this._chats;
    }

    public get chatColour(): string
    { 
        var colour: string;

        switch (this._participantOther.relationshipStatus)
        { 
            case RelationshipStatusEnum.NONE:
                colour = "bg-blue";
                break
            case RelationshipStatusEnum.HEART:
                colour = "bg-pink";
                break;
            case RelationshipStatusEnum.SMILE:
                colour = "bg-warning";
                break;
            case RelationshipStatusEnum.BOBBA:
                colour = "bg-dark";
                break;
            default:
                colour = "bg-blue";
                break;
        }

        return colour;
    }
}