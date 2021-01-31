export class ModtoolRoomChatlogLine
{
    private readonly _timestamp: string;
    private readonly _habboId: number;
    private readonly _username: string;
    private readonly _message: string;
    private _boolean: boolean;

    constructor(timestamp: string, habboId: number, username: string, message: string, boolean: boolean)
    {
        this._timestamp = timestamp;
        this._habboId = habboId;
        this._username = username;
        this._message = message;
        this._boolean = boolean;
    }

    public get timestamp(): string
    {
        return this._timestamp;
    }

    public get habboId(): number
    {
        return this._habboId;
    }

    public get username(): string
    {
        return this._username;
    }

    public get message(): string
    {
        return this._message;
    }
}
