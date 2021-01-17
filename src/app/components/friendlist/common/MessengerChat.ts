import { MessengerFriend } from './MessengerFriend';

export class MessengerChat
{
    public static CHAT: number                  = 0;
    public static ROOM_INVITE: number           = 1;
    public static STATUS_NOTIFICATION: number   = 2;

    private _type: number;
    private _sender: MessengerFriend;
    private _message: string;
    private _secondsSinceSent: number;
    private _extraData: string;

    constructor(sender: MessengerFriend, message: string, secondsSinceSent: number, extraData: string, type: number = 0)
    {
        this._type              = type;
        this._sender            = sender;
        this._message           = message;
        this._secondsSinceSent  = secondsSinceSent;
        this._extraData = extraData;
        
    }

    public get type(): number
    {
        return this._type;
    }

    public get sender(): MessengerFriend
    {
        return this._sender;
    }

    public get message(): string
    {
        return this._message;
    }

    public get secondsSinceSent(): number
    {
        return this._secondsSinceSent;
    }

    public get extraData(): string
    {
        return this._extraData;
    }

}