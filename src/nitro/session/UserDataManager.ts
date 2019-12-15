import { Disposable } from '../../core/common/disposable/Disposable';
import { IConnection } from '../../core/communication/connections/IConnection';

export class UserDataManager extends Disposable
{
    private _connection: IConnection;

    constructor()
    {
        super();

        this._connection = null;
    }

    protected onDispose(): void
    {
        this._connection = null;
    }

    public setConnection(connection: IConnection)
    {
        if(!connection) return;

        this._connection = connection;
    }

    public get connection(): IConnection
    {
        return this._connection;
    }
}