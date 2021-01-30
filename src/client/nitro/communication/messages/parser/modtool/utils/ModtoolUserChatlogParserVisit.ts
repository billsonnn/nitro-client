import { ModtoolUserChatlogParserChatlog } from './ModtoolUserChatlogParserChatlog';

export class ModtoolUserChatlogParserVisit
{
    private readonly _roomName: string;
    private readonly _roomId: number;
    private readonly _chatlogs: ModtoolUserChatlogParserChatlog[];

    constructor(roomName: string, roomId: number, chatlogs: ModtoolUserChatlogParserChatlog[])
    {
        this._roomName = roomName;
        this._roomId = roomId;
        this._chatlogs = chatlogs;
    }

    public get roomName(): string
    {
        return this._roomName;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public get chatlogs(): ModtoolUserChatlogParserChatlog[]
    {
        return this._chatlogs;
    }
}
