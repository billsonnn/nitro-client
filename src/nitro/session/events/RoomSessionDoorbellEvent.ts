import { IRoomSession } from '../IRoomSession';
import { RoomSessionEvent } from './RoomSessionEvent';

export class RoomSessionDoorbellEvent extends RoomSessionEvent
{
    public static RSDE_DOORBELL: string = 'RSDE_DOORBELL';
    public static REJECTED: string = 'RSDE_REJECTED';
    public static RSDE_ACCEPTED: string = 'RSDE_ACCEPTED';

    private _userName: string = '';

    constructor(k: string, _arg_2: IRoomSession, _arg_3: string)
    {
        super(k, _arg_2);

        this._userName = _arg_3;
    }

    public get userName(): string
    {
        return this._userName;
    }
}