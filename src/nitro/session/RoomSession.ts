import { Disposable } from '../../core/common/disposable/Disposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { IRoomSession } from './IRoomSession';
import { UserDataManager } from './UserDataManager';

export class RoomSession extends Disposable implements IRoomSession
{
    private _connection: IConnection;
    private _userData: UserDataManager;

    constructor()
    {
        super();

        this._userData = new UserDataManager();
    }

    protected onDispose(): void
    {
        if(this._userData)
        {
            this._userData.dispose();

            this._userData = null;
        }

        this._connection = null;
    }

    public setConnection(connection: IConnection)
    {
        if(!connection) return;

        this._connection = connection;

        if(this._userData) this._userData.setConnection(connection);
    }

    public get connection(): IConnection
    {
        return this._connection;
    }

    public get userData(): UserDataManager
    {
        return this._userData;
    }
}