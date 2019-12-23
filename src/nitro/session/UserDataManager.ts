import { Disposable } from '../../core/common/disposable/Disposable';
import { IRoomSession } from './IRoomSession';

export class UserDataManager extends Disposable
{
    private _roomSession: IRoomSession;

    constructor(roomSession: IRoomSession)
    {
        super();

        this._roomSession = roomSession;
    }

    protected onDispose(): void
    {
        this._roomSession = null;
    }

    public get roomSession(): IRoomSession
    {
        return this._roomSession;
    }
}