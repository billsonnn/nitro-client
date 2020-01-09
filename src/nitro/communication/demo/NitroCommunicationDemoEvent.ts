import { IConnection } from '../../../core/communication/connections/IConnection';
import { NitroEvent } from '../../../core/events/NitroEvent';

export class NitroCommunicationDemoEvent extends NitroEvent
{
    public static CONNECTION_ESTABLISHED        = 'NCE_ESTABLISHED';
    public static CONNECTION_HANDSHAKING        = 'NCE_HANDSHAKING';
    public static CONNECTION_HANDSHAKED         = 'NCE_HANDSHAKED';
    public static CONNECTION_HANDSHAKE_FAILED   = 'NCE_HANDSHAKE_FAILED';
    public static CONNECTION_AUTHENTICATED      = 'NCE_AUTHENTICATED';

    private _connection: IConnection;

    constructor(type: string, connection: IConnection)
    {
        super(type);

        this._connection = connection;
    }

    public get connection(): IConnection
    {
        return this._connection;
    }
}