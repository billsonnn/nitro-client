import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetFriendRequestUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWFRUE_SHOW_FRIEND_REQUEST: string = 'RWFRUE_SHOW_FRIEND_REQUEST';
    public static RWFRUE_HIDE_FRIEND_REQUEST: string = 'RWFRUE_HIDE_FRIEND_REQUEST';

    private _Str_2914: number;
    private _userId: number;
    private _userName: string;

    constructor(k: string, _arg_2: number, _arg_3: number = 0, _arg_4: string = null)
    {
        super(k);
        
        this._Str_2914 = _arg_2;
        this._userId = _arg_3;
        this._userName = _arg_4;
    }

    public get _Str_2951(): number
    {
        return this._Str_2914;
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