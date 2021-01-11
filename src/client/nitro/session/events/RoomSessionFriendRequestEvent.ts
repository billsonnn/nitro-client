import { IRoomSession } from '../IRoomSession';
import { RoomSessionEvent } from './RoomSessionEvent';

export class RoomSessionFriendRequestEvent extends RoomSessionEvent
{
    public static RSFRE_FRIEND_REQUEST: string = 'RSFRE_FRIEND_REQUEST';

    private _requestId: number = 0;
    private _userId: number = 0;
    private _userName: string;

    constructor(k: IRoomSession, _arg_2: number, _arg_3: number, _arg_4: string)
    {
        super(RoomSessionFriendRequestEvent.RSFRE_FRIEND_REQUEST, k);

        this._requestId = _arg_2;
        this._userId = _arg_3;
        this._userName = _arg_4;
    }

    public get _Str_2951(): number
    {
        return this._requestId;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get userName(): string
    {
        return this._userName;
    }
}