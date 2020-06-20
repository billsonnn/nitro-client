import { IRoomSession } from '../IRoomSession';
import { RoomSessionEvent } from './RoomSessionEvent';

export class RoomSessionDanceEvent extends RoomSessionEvent
{
    public static RSDE_DANCE: string = 'RSDE_DANCE';

    private _userId: number;
    private _danceStyle: number;

    constructor(k: IRoomSession, _arg_2: number, _arg_3: number)
    {
        super(RoomSessionDanceEvent.RSDE_DANCE, k);

        this._userId = _arg_2;
        this._danceStyle = _arg_3;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get _Str_8263(): number
    {
        return this._danceStyle;
    }
}