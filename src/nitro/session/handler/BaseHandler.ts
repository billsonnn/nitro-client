import { Disposable } from '../../../core/common/disposable/Disposable';
import { IConnection } from '../../../core/communication/connections/IConnection';
import { IRoomHandlerListener } from '../IRoomHandlerListener';

export class BaseHandler extends Disposable
{
    private _connection: IConnection;
    private _listener: IRoomHandlerListener;

    constructor(connection: IConnection, listener: IRoomHandlerListener)
    {
        super();

        this._connection    = connection;
        this._listener      = listener;
    }

    protected onDispose(): void
    {
        this._connection    = null;
        this._listener      = null;
    }

    public get connection(): IConnection
    {
        return this._connection;
    }

    public get listener(): IRoomHandlerListener
    {
        return this._listener;
    }
}