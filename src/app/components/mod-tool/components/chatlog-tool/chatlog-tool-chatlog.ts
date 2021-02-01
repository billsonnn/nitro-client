import { ModtoolRoomChatlogLine } from '../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolRoomChatlogLine';

export class ChatlogToolChatlog
{

    private _id: number;
    private _name: string;
    private _chatlogs: ModtoolRoomChatlogLine[];

    constructor(id: number, name: string, chatlogs: ModtoolRoomChatlogLine[])
    {
        this._id = id;
        this._name = name;
        this._chatlogs = chatlogs;
    }

    get id(): number
    {
        return this._id;
    }

    get name(): string
    {
        return this._name;
    }

    get chatlogs(): ModtoolRoomChatlogLine[]
    {
        return this._chatlogs;
    }
}
